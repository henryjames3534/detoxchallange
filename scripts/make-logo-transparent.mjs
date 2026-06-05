import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const input =
  process.argv[2] ??
  join(
    __dirname,
    "../src/assets/acuactiv-logo-source.png",
  );
const output =
  process.argv[3] ?? join(__dirname, "../src/assets/acuactiv-logo-source.png");

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const threshold = 48;

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (r <= threshold && g <= threshold && b <= threshold) {
    data[i + 3] = 0;
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .trim({ threshold: 5 })
  .toFile(output);

console.log("Saved header logo to", output);
