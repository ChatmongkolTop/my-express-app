const nodemailer = require('nodemailer');
const resetPasswordTemplate = require('../templates/resetPasswordEmail');
const passwordChangedTemplate = require('../templates/passwordChangedEmail');

// ตั้งค่า Transporter (ควรเก็บ Config ไว้ใน .env)
const transporter = nodemailer.createTransport({
    service: 'gmail', // หรือใช้ host, port ตาม SMTP Server ของคุณ
    auth: {
        user: process.env.MAIL_USER || 'your-email@gmail.com',
        pass: process.env.MAIL_PASS || 'your-app-password'
    }
});

exports.sendPasswordResetEmail = async (to, resetUrl, userName) => {
    try {
        await transporter.sendMail({
            from: process.env.MAIL_FROM || '"Support Team" <noreply@example.com>',
            to: to,
            subject: 'Reset Your Password',
            html: resetPasswordTemplate(userName, resetUrl)
        });
        //console.log(`Password reset email sent to ${to}`);
    } catch (error) {
        //console.error('Email sending failed:', error);
        throw new Error('EMAIL_SEND_FAILED');
    }
};

exports.sendPasswordChangedEmail = async (to, userName) => {
    try {
        await transporter.sendMail({
            from: process.env.MAIL_FROM || '"Support Team" <noreply@example.com>',
            to: to,
            subject: 'Your Password Has Been Changed',
            html: passwordChangedTemplate(userName)
        });
        console.log(`Password changed notification sent to ${to}`);
    } catch (error) {
        console.error('Email sending failed:', error);
        // ไม่ throw Error เพราะการเปลี่ยนรหัสผ่านสำเร็จแล้ว แค่ส่งเมลแจ้งเตือนไม่ผ่าน
    }
};