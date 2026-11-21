import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const INPUT_DIR = 'raw-images';
const OUTPUT_DIR = 'src/assets/images';
const RESPONSIVE_WIDTHS = [400, 800, 1400];
const DEVICE_MAX_WIDTH = {
  mobile: 640, // 2x для 320px
  phone: 640,
  tablet: 1000,
  desktop: 1440,
};

if (!fs.existsSync(INPUT_DIR)) {
  console.error(`Папку "${INPUT_DIR}" не знайдено.`);
  process.exit(1);
}

fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const files = fs
  .readdirSync(INPUT_DIR)
  .filter((file) => /\.(jpe?g|png|webp)$/i.test(file) && file.toLowerCase() !== 'logo.png');

const formatKB = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

for (const file of files) {
  const { name } = path.parse(file);
  const inputPath = path.join(INPUT_DIR, file);
  const match = name.match(/-(desktop|tablet|mobile|phone)$/i);

  if (match) {
    const maxWidth = DEVICE_MAX_WIDTH[match[1].toLowerCase()];
    const image = sharp(inputPath).resize({ width: maxWidth, withoutEnlargement: true });

    const avifPath = path.join(OUTPUT_DIR, `${name}.avif`);
    const webpPath = path.join(OUTPUT_DIR, `${name}.webp`);
    const pngPath = path.join(OUTPUT_DIR, `${name}.png`);

    await image.clone().avif({ quality: 50 }).toFile(avifPath);
    await image.clone().webp({ quality: 78 }).toFile(webpPath);
    await image.clone().png({ compressionLevel: 9 }).toFile(pngPath);

    console.log(`${file} -> AVIF: ${formatKB(fs.statSync(avifPath).size)}`);
  } else {
    for (const width of RESPONSIVE_WIDTHS) {
      const resized = sharp(inputPath).resize({ width, withoutEnlargement: true });
      const avifPath = path.join(OUTPUT_DIR, `${name}-${width}.avif`);
      const webpPath = path.join(OUTPUT_DIR, `${name}-${width}.webp`);
      const pngPath = path.join(OUTPUT_DIR, `${name}-${width}.png`);

      await resized.clone().avif({ quality: 50 }).toFile(avifPath);
      await resized.clone().webp({ quality: 78 }).toFile(webpPath);
      await resized.clone().png({ compressionLevel: 9 }).toFile(pngPath);
    }
  }
}
