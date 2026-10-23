// Renders assets/app-icon.svg to every size the app serves: `node assets/render-icons.mjs`.
// Playwright's Chromium draws it; the favicon is two of the PNGs in an .ico wrapper.
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";

const svg = readFileSync("assets/app-icon.svg", "utf8");
const SIZES = {
  "public/icons/icon-512.png": 512,
  "public/icons/icon-192.png": 192,
  "src/app/apple-icon.png": 180,
};
const FAVICON_SIZES = [32, 48];

const browser = await chromium.launch();
const page = await browser.newPage();
// `rounded` clips the corners: a tab's icon looks better for it, and the transparency makes the PNG
// RGBA, which an .ico requires. A home screen rounds the others itself.
const render = async (size, rounded = false) => {
  await page.setViewportSize({ width: size, height: size });
  const radius = rounded ? "border-radius:22%;" : "";
  await page.setContent(
    `<style>*{margin:0}svg{display:block;width:${size}px;height:${size}px;${radius}}</style>${svg}`,
  );
  return page.screenshot({ omitBackground: rounded });
};

for (const [path, size] of Object.entries(SIZES)) writeFileSync(path, await render(size));

// An .ico is a directory of images; each entry may be a whole PNG.
const pngs = [];
for (const size of FAVICON_SIZES) pngs.push(await render(size, true));
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((png, i) => {
  const at = 6 + 16 * i;
  header.writeUInt8(FAVICON_SIZES[i], at);
  header.writeUInt8(FAVICON_SIZES[i], at + 1);
  header.writeUInt16LE(1, at + 4);
  header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(png.length, at + 8);
  header.writeUInt32LE(offset, at + 12);
  offset += png.length;
});
writeFileSync("src/app/favicon.ico", Buffer.concat([header, ...pngs]));

await browser.close();
