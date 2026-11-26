import { cp, mkdir, readFile, readdir, realpath, rm, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { SiteAsset } from "../worker/assets.js";

const root = await realpath(fileURLToPath(new URL("../../", import.meta.url)));
const compiled = fileURLToPath(new URL("../", import.meta.url));
const dist = join(root, "dist");
const output = join(dist, "server");
const assets: Record<string, SiteAsset> = {};

const contentTypes: Partial<Record<string, string>> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

async function addAsset(path: string, filename: string, extension = extname(filename)) {
  assets[path] = {
    type: contentTypes[extension] ?? "application/octet-stream",
    body: (await readFile(filename)).toString("base64"),
  };
}

async function addDirectory(directory: string, prefix: string): Promise<void> {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const filename = join(directory, entry.name);
    const path = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) await addDirectory(filename, path);
    else if (entry.isFile()) await addAsset(path, filename);
  }
}

// Next prerenders the homepage. The Sites Worker serves its assets and the chat API.
await addAsset("/", join(root, ".next/server/app/index.html"));
await addAsset("/404.html", join(root, ".next/server/app/_not-found.html"));
await addAsset("/icon.svg", join(root, ".next/server/app/icon.svg.body"), ".svg");
await addDirectory(join(root, ".next/static"), "/_next/static");
await addDirectory(join(root, "public"), "");

// Replace only this build's generated Worker directory, including obsolete files.
await mkdir(output, { recursive: true });
if (await realpath(dist) !== dist || await realpath(output) !== output) {
  throw new Error("The Sites output directory must be inside this checkout.");
}
await rm(output, { recursive: true });
await mkdir(join(output, "worker"), { recursive: true });
await Promise.all([
  writeFile(join(output, "index.js"), 'export { default } from "./worker/index.js";\n'),
  writeFile(join(output, "worker/assets.js"), `export default ${JSON.stringify(assets)};\n`),
  cp(join(compiled, "worker/index.js"), join(output, "worker/index.js")),
  cp(join(compiled, "app"), join(output, "app"), { recursive: true }),
]);
