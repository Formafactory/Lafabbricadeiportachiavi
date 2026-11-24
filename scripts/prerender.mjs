// Dopo `vite build` e `vite build --ssr`: scrive l'HTML della pagina dentro dist/index.html,
// così la pagina è leggibile anche senza JavaScript e dai motori di ricerca.
import { readFile, writeFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const ssr = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);
const html = ssr.render();
const file = resolve("dist/index.html");
const base = await readFile(file, "utf8");
const marker = '<div id="root"></div>';
if (!base.includes(marker)) throw new Error("Segnaposto #root non trovato in dist/index.html");
await writeFile(file, base.replace(marker, `<div id="root">${html}</div>`));
await rm(resolve("dist-ssr"), { recursive: true, force: true });
console.log(`prerender: index.html (${html.length} caratteri di HTML)`);
