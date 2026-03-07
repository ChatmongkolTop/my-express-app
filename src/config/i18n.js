const i18n = require('i18n');
const path = require('path');

i18n.configure({
    locales: ['en', 'th'], // ภาษาที่รองรับ
    directory: path.join(__dirname, '../../locales'), // โฟลเดอร์เก็บไฟล์ภาษา
    defaultLocale: process.env.I18N_DEFAULT_LOCALE || 'en',
    objectNotation: true, // รองรับ Nested JSON
    updateFiles: false, // ไม่ต้องสร้าง Key อัตโนมัติใน Production
    header: 'accept-language' // ใช้ Header ในการเปลี่ยนภาษา
});

module.exports = i18n;
