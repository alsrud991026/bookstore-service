const nodemailer = require('nodemailer');
const conn = require('../mariadb');

const generateAuthCode = () => {
    const authCode = Math.random().toString().slice(2, 8);
    return authCode;
};

const sendAuthCodeEmail = async (email) => {
    const connection = await conn.getConnection();

    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;

    const authCode = generateAuthCode();
    const expiry = Date.now() + 1000 * 60 * 3;

    const sqlInsert = `insert into authCode (email, auth_code, expiry) values (?, ?, ?)
     on duplicate key update auth_code = values(auth_code), expiry = values(expiry)`;
    const values = [email, authCode, expiry];

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: '회원가입 인증 코드',
        text: `회원가입 인증 코드는 ${authCode}입니다.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        await connection.query(sqlInsert, values);
    } catch (err) {
        console.log(err);
        throw new Error('메일 전송에 실패하였습니다.');
    }
};

module.exports = { sendAuthCodeEmail };
