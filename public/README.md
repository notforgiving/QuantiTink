# Public Assets

Эта папка содержит статические файлы для приложения QuantiTink.

## Логотип

- `logo.svg` - основной SVG логотип (используется везде)
- `logo192.png` - иконка 192x192 для PWA
- `logo512.png` - иконка 512x512 для PWA
- `favicon.ico` - фавикон для браузера

## Генерация PNG иконок

Для генерации PNG версий из SVG используйте:

```bash
npm install --save-dev sharp
npm run generate-icons
```

Или используйте онлайн-конвертер:
1. Откройте `logo.svg` в браузере
2. Используйте инструменты разработчика для экспорта
3. Или используйте [CloudConvert](https://cloudconvert.com/svg-to-png) или [Convertio](https://convertio.co/svg-png/)

## Файлы

- `index.html` - главный HTML файл
- `manifest.json` - манифест PWA
- `robots.txt` - правила для поисковых роботов

