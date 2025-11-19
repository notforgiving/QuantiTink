/**
 * Скрипт для генерации PNG иконок из SVG логотипа
 * Требует установки sharp: npm install --save-dev sharp
 * 
 * Запуск: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

try {
  // Проверяем наличие sharp
  const sharp = require('sharp');
  
  const publicDir = path.join(__dirname, '..', 'public');
  const logoSvgPath = path.join(publicDir, 'logo.svg');
  
  // Читаем актуальный SVG файл из папки public
  if (!fs.existsSync(logoSvgPath)) {
    console.error('❌ Файл public/logo.svg не найден!');
    process.exit(1);
  }
  
  const logoSvg = fs.readFileSync(logoSvgPath, 'utf8');
  const svgBuffer = Buffer.from(logoSvg);
  
  console.log('📖 Читаю logo.svg из папки public...');
  
  // Генерируем logo192.png
  sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'logo192.png'))
    .then(() => console.log('✅ Создан logo192.png'))
    .catch(err => console.error('❌ Ошибка создания logo192.png:', err));
  
  // Генерируем logo512.png
  sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo512.png'))
    .then(() => console.log('✅ Создан logo512.png'))
    .catch(err => console.error('❌ Ошибка создания logo512.png:', err));
  
  // Генерируем favicon.ico (16x16)
  sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'))
    .then(() => console.log('✅ Создан favicon.ico'))
    .catch(err => console.error('❌ Ошибка создания favicon.ico:', err));
  
  console.log('\n✨ Генерация иконок завершена!');
    
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('⚠ Sharp не установлен. Установите: npm install --save-dev sharp');
    console.log('Или используйте онлайн-конвертер для создания PNG из public/logo.svg');
    console.log('Рекомендуемые размеры: 192x192 и 512x512');
  } else {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

