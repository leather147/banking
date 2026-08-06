"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

const SELECTOR = "#app-scroll-region [data-slot='card'], #app-scroll-region section, #app-scroll-region [data-reveal]";

export function ScrollRevealController() {
  const pathname = usePathname();

  React.useEffect(() => {
    const root = document.querySelector<HTMLElement>("#app-scroll-region");
    if (root) root.scrollTop = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observed = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-scroll-reveal", "visible");
        observer.unobserve(entry.target);
      }
    }, { root, rootMargin: "0px 0px -4%", threshold: 0.04 });

    const register = () => {
      document.querySelectorAll(SELECTOR).forEach((node) => {
        if (observed.has(node)) return;
        observed.add(node);
        node.setAttribute("data-scroll-reveal", "pending");
        observer.observe(node);
      });
    };
    const frame = requestAnimationFrame(register);
    const mutationObserver = new MutationObserver(register);
    if (root) mutationObserver.observe(root, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
