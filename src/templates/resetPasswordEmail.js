module.exports = (userName, resetUrl) => {
    return `
    <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
      <h2>สวัสดีคุณ ${userName}</h2>
      <p>เราได้รับคำขอรีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ หากคุณเป็นคนทำรายการนี้ โปรดคลิกปุ่มด้านล่าง:</p>
      <a href="${resetUrl}" 
         style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
         รีเซ็ตรหัสผ่านใหม่
      </a>
      <p>ลิงก์นี้จะหมดอายุภายใน 15 นาที</p>
      <p>หากคุณไม่ได้ขอนโยบายนี้ โปรดละเลยอีเมลฉบับนี้</p>
      <hr>
      <h2>Hello ${userName}</h2>
      <p>We received a request to reset your password for your account. If you made this request, please click the button below:</p>
      <a href="${resetUrl}" 
         style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
         Reset Password
      </a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <hr>
      <small>ส่งโดยระบบอัตโนมัติ - โปรดอย่าตอบกลับ / Automated message - please do not reply</small>
    </div>
    `;
};