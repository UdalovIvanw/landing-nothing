import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const INPUT_DIR = 'raw-images';
const OUTPUT_DIR = 'src/assets/images';
const RESPONSIVE_WIDTHS = [400, 800, 1400];
const DEVICE_SUFFIX_RE = /-(desktop|tablet|mobile|phone)$/i;

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
  const originalSize = fs.statSync(inputPath).size;
  const hasDeviceSuffix = DEVICE_SUFFIX_RE.test(name);

  console.log(`\nОбробка: ${file} (оригінал: ${formatKB(originalSize)})`);

  if (hasDeviceSuffix) {
    // Зображення під конкретний пристрій: зберігаємо оригінальний розмір, змінюємо лише формат
    const image = sharp(inputPath);
    const avifPath = path.join(OUTPUT_DIR, `${name}.avif`);
    const webpPath = path.join(OUTPUT_DIR, `${name}.webp`);
    const pngPath = path.join(OUTPUT_DIR, `${name}.png`);

    await image.clone().avif({ quality: 65 }).toFile(avifPath);
    await image.clone().webp({ quality: 80 }).toFile(webpPath);
    await image.clone().png({ compressionLevel: 8 }).toFile(pngPath);

    console.log(
      `  1:1 -> AVIF: ${formatKB(fs.statSync(avifPath).size)} | ` +
        `WebP: ${formatKB(fs.statSync(webpPath).size)} | ` +
        `PNG: ${formatKB(fs.statSync(pngPath).size)}`,
    );
  } else {
    // Універсальні зображення без приписки девайсу: генеруємо варіанти під srcset
    for (const width of RESPONSIVE_WIDTHS) {
      const resized = sharp(inputPath).resize({ width, withoutEnlargement: true });
      const avifPath = path.join(OUTPUT_DIR, `${name}-${width}.avif`);
      const webpPath = path.join(OUTPUT_DIR, `${name}-${width}.webp`);
      const pngPath = path.join(OUTPUT_DIR, `${name}-${width}.png`);

      await resized.clone().avif({ quality: 65 }).toFile(avifPath);
      await resized.clone().webp({ quality: 80 }).toFile(webpPath);
      await resized.clone().png({ compressionLevel: 8 }).toFile(pngPath);

      console.log(
        `  ${width}w -> AVIF: ${formatKB(fs.statSync(avifPath).size)} | ` +
          `WebP: ${formatKB(fs.statSync(webpPath).size)} | ` +
          `PNG: ${formatKB(fs.statSync(pngPath).size)}`,
      );
    }
  }
}

console.log('\nГотово! Усі зображення збережено в src/assets/images/');
