const guestTokens = new Map();
const GUEST_TOKEN_LIFETIME_MINUTES = parseInt(process.env.SWAGGER_GUEST_TOKEN_LIFE) || 15;

/**
 * สร้างรหัสผ่าน 6 หลักแบบสุ่มสำหรับ Guest
 * @returns {string} รหัสผ่านที่สร้างขึ้น
 */
function generate() {
    const password = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + GUEST_TOKEN_LIFETIME_MINUTES * 60 * 1000;
    guestTokens.set(password, expiry);
    console.log(`Generated new Swagger guest password: ${password}, valid for ${GUEST_TOKEN_LIFETIME_MINUTES} minutes.`);
    return password;
}

/**
 * ตรวจสอบความถูกต้องของรหัสผ่าน Guest
 * @param {string} password รหัสผ่านที่ต้องการตรวจสอบ
 * @returns {boolean} คืนค่า true ถ้ารหัสถูกต้องและยังไม่หมดอายุ
 */
function validate(password) {
    if (!guestTokens.has(password)) {
        return false;
    }
    const expiry = guestTokens.get(password);
    if (Date.now() > expiry) {
        guestTokens.delete(password); // ลบรหัสที่หมดอายุแล้ว
        return false;
    }
    return true;
}

// ตั้งเวลาให้ระบบลบรหัสที่หมดอายุอัตโนมัติทุกๆ 5 นาที
setInterval(() => {
    const now = Date.now();
    for (const [password, expiry] of guestTokens.entries()) {
        if (now > expiry) guestTokens.delete(password);
    }
}, 5 * 60 * 1000);

module.exports = {
    generate,
    validate,
};