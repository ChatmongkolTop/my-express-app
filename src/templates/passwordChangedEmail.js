module.exports = (userName) => {
    return `
    <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
      <h2>สวัสดีคุณ ${userName}</h2>
      <p>รหัสผ่านสำหรับบัญชีของคุณถูกเปลี่ยนเรียบร้อยแล้ว</p>
      <p>หากคุณเป็นคนทำรายการนี้ คุณสามารถละเลยอีเมลฉบับนี้ได้</p>
      <p style="color: red;"><strong>หากคุณไม่ได้เป็นคนเปลี่ยนรหัสผ่าน โปรดติดต่อผู้ดูแลระบบทันทีเพื่อระงับบัญชี</strong></p>
      <hr>
      <h2>Hello ${userName}</h2>
      <p>Your account password has been successfully changed.</p>
      <p>If you made this change, you can ignore this email.</p>
      <p style="color: red;"><strong>If you did not change your password, please contact the administrator immediately to suspend your account.</strong></p>
      <hr>
      <small>ส่งโดยระบบอัตโนมัติ - โปรดอย่าตอบกลับ / Automated message - please do not reply</small>
    </div>
    `;
};