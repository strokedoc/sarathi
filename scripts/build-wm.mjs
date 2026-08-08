// Builds public/wm/ch1.json … ch18.json — per-chapter word-by-word meaning lookups,
// keyed by verse ref, sourced from bhagavad-gita-700.json's `wm` field.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcPath = path.resolve(__dirname, "../../bhagavad-gita-700.json");
const outDir = path.resolve(__dirname, "../public/wm");

const verses = JSON.parse(readFileSync(srcPath, "utf8"));
mkdirSync(outDir, { recursive: true });

const byChapter = new Map();
for (const v of verses) {
  if (!v.wm) continue;
  if (!byChapter.has(v.ch)) byChapter.set(v.ch, {});
  byChapter.get(v.ch)[v.ref] = v.wm;
}

for (let ch = 1; ch <= 18; ch++) {
  const obj = byChapter.get(ch) || {};
  writeFileSync(path.join(outDir, `ch${ch}.json`), JSON.stringify(obj));
}

console.log(`Wrote ${byChapter.size} chapter files to ${outDir}`);
