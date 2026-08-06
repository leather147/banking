import { mkdir, readFile, readdir, realpath, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const modulesRoot = path.join(projectRoot, "node_modules");
const outputRoot = path.join(projectRoot, "public", "generated", "licenses");
const packagesRoot = path.join(outputRoot, "packages");
const rootPackage = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));
const directPackages = new Set([...Object.keys(rootPackage.dependencies ?? {}), ...Object.keys(rootPackage.devDependencies ?? {})]);
const visitedPaths = new Set();
const visitedPackages = new Set();
const entries = [];

async function listPackageDirectories(nodeModulesPath) {
  let directoryEntries;
  try {
    directoryEntries = await readdir(nodeModulesPath, { withFileTypes: true });
  } catch {
    return [];
  }
  const result = [];
  for (const entry of directoryEntries) {
    if (entry.name === ".bin" || entry.name === ".cache" || entry.name === ".bun") continue;
    const entryPath = path.join(nodeModulesPath, entry.name);
    if (entry.name.startsWith("@")) {
      let scoped;
      try { scoped = await readdir(entryPath, { withFileTypes: true }); } catch { continue; }
      for (const packageEntry of scoped) if (packageEntry.isDirectory() || packageEntry.isSymbolicLink()) result.push(path.join(entryPath, packageEntry.name));
    } else if (entry.isDirectory() || entry.isSymbolicLink()) {
      result.push(entryPath);
    }
  }
  return result;
}

function normalizeLicense(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(normalizeLicense).filter(Boolean).join(", ");
  if (value && typeof value === "object") return value.type ?? value.name ?? "Не указана";
  return "Не указана";
}

function normalizeRepository(value) {
  if (typeof value === "string") return value;
  return value?.url ?? null;
}

async function collectDocuments(packagePath) {
  let files;
  try { files = await readdir(packagePath, { withFileTypes: true }); } catch { return []; }
  const candidates = files.filter((entry) => entry.isFile() && /^(licen[cs]e|copying|notice|copyright)(\.|$)/i.test(entry.name));
  const documents = [];
  for (const candidate of candidates) {
    try {
      const filePath = path.join(packagePath, candidate.name);
      const fileStat = await stat(filePath);
      const content = await readFile(filePath, "utf8");
      documents.push({ name: candidate.name, content: content.slice(0, 500_000), truncated: fileStat.size > 500_000 });
    } catch {
      // A broken optional package must not make the application build fail.
    }
  }
  return documents;
}

async function visitPackage(packagePath, queue) {
  let resolved;
  try { resolved = await realpath(packagePath); } catch { return; }
  if (visitedPaths.has(resolved)) return;
  visitedPaths.add(resolved);
  let metadata;
  try { metadata = JSON.parse(await readFile(path.join(resolved, "package.json"), "utf8")); } catch { return; }
  if (!metadata.name || !metadata.version) return;
  const identity = `${metadata.name}@${metadata.version}`;
  // Bun can expose the same physical package through several symlinks. Package
  // identity deduplication keeps the generated index deterministic and compact.
  if (!visitedPackages.has(identity)) {
    visitedPackages.add(identity);
    const documents = await collectDocuments(resolved);
    const slug = Buffer.from(identity).toString("base64url");
    const detailPath = `/generated/licenses/packages/${slug}.json`;
    const detail = {
      name: metadata.name,
      version: metadata.version,
      license: normalizeLicense(metadata.license ?? metadata.licenses),
      description: metadata.description ?? "",
      homepage: metadata.homepage ?? null,
      repository: normalizeRepository(metadata.repository),
      author: typeof metadata.author === "string" ? metadata.author : metadata.author?.name ?? null,
      documents,
    };
    await writeFile(path.join(packagesRoot, `${slug}.json`), JSON.stringify(detail));
    entries.push({
      name: detail.name,
      version: detail.version,
      license: detail.license,
      direct: directPackages.has(detail.name),
      documentCount: documents.length,
      detailPath,
    });
  }
  queue.push(...await listPackageDirectories(path.join(resolved, "node_modules")));
}

// Generate into a disposable public tree at build time. The output is ignored
// by Git because its legal contents must match the dependencies actually used.
await rm(outputRoot, { recursive: true, force: true });
await mkdir(packagesRoot, { recursive: true });
const queue = await listPackageDirectories(modulesRoot);
while (queue.length) await visitPackage(queue.shift(), queue);
entries.sort((left, right) => Number(right.direct) - Number(left.direct) || left.name.localeCompare(right.name) || left.version.localeCompare(right.version));
await writeFile(path.join(outputRoot, "index.json"), JSON.stringify({ generatedAt: new Date().toISOString(), packageCount: entries.length, packages: entries }));
console.log(`Generated license documents for ${entries.length} packages.`);
