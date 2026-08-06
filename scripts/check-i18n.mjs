import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const localeRoot = path.join(projectRoot, "src", "i18n", "locales");

async function readDictionary(locale) {
  const files = [
    path.join(localeRoot, `${locale}.json`),
    path.join(localeRoot, "extensions", `${locale}.json`),
    path.join(localeRoot, "product", `${locale}.json`),
    path.join(localeRoot, "features", `${locale}.json`),
  ];
  const dictionaries = await Promise.all(files.map(async (file) => JSON.parse(await readFile(file, "utf8"))));
  return Object.assign({}, ...dictionaries);
}

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(target);
    return /\.(ts|tsx)$/.test(entry.name) ? [target] : [];
  }));
  return nested.flat();
}

const [english, russian, files] = await Promise.all([
  readDictionary("en"),
  readDictionary("ru"),
  sourceFiles(path.join(projectRoot, "src")),
]);

const usages = new Map();
const patterns = [
  /\bt\(\s*["']([^"']+)["']/g,
  /\b(?:translationKey|descriptionKey)\s*:\s*["']([^"']+)["']/g,
];

for (const file of files) {
  const source = await readFile(file, "utf8");
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const locations = usages.get(match[1]) ?? [];
      locations.push(path.relative(projectRoot, file));
      usages.set(match[1], locations);
    }
  }
}

const missing = [];
for (const [key, locations] of usages) {
  const locales = [!english[key] && "en", !russian[key] && "ru"].filter(Boolean);
  if (locales.length) missing.push({ key, locales, file: locations[0] });
}

if (missing.length) {
  console.error(`Missing ${missing.length} static translation keys:`);
  for (const item of missing) console.error(`- ${item.key} [${item.locales.join(", ")}] · ${item.file}`);
  process.exitCode = 1;
} else {
  console.log(`i18n check passed: ${usages.size} static keys exist in English and Russian.`);
}
