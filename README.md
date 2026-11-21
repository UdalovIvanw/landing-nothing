# Nothing

Nothing

- **Methodology:** BEM + ITCSS
- **Figma template:** [https://www.figma.com/design/xIVUXiPZ3hdpEFiIC0qbTL/BOSE-New-Version?node-id=6802-139&p=f&t=Skvqrbk4qw0MADZ2-0](Figma template)
- **DEMO** [https://udalovivanw.github.io/landing-nothing/](https://udalovivanw.github.io/landing-nothing/)

## Command list

| Команда           | Призначення                                                                            |
| :---------------- | :------------------------------------------------------------------------------------- |
| `npm install`     | Встановлення залежностей із `package-lock.json` та ініціалізація Git-хуків (`prepare`) |
| `npm run dev`     | Запуск dev-сервера Vite (`http://localhost:5173/`)                                     |
| `npm run build`   | Збірка у `dist/` (компіляція Pug/SCSS, PostCSS, мініфікація)                           |
| `npm run preview` | Локальний перегляд зібраного проєкту (`http://localhost:4173/landing-nothing/`)        |
| `npm run images`  | Пакетна конвертація оригіналів у AVIF, WebP та JPEG (`400w` і `800w`) через `sharp`    |
| `npm run format`  | Prettier                                                                               |
| `npm run lint`    | Перевірка якості SCSS (`stylelint`) та стилю форматування (`prettier --check`)         |
