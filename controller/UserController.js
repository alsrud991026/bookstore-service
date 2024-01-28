const { sendAuthCodeEmail } = require('../utils/emailSender');
const camelcaseKeys = require('camelcase-keys');
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUserByEmail = async (connection, email) => {
    const selectEmail = 'select * from users where email = ?';

    const [rows] = await connection.query(selectEmail, email);
    return rows.length > 0 ? rows[0] : null;
};

const hashPassword = async (password) => {
    const saltRounds = 10;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (err) {
        console.log(err);
        throw new Error('비밀번호 암호화 중 문제가 발생하였습니다.');
    }
};

const comparePassword = async (password, hashedPwd) => {
    try {
        return await bcrypt.compare(password, hashedPwd);
    } catch (err) {
        console.log(err);
        throw new Error('비밀번호 비교 중 문제가 발생하였습니다.');
    }
};

const signupRequest = async (req, res) => {
    const connection = await conn.getConnection();
    const { email } = req.body;

    try {
        await sendAuthCodeEmail(email);
        return res.status(StatusCodes.OK).json({
            message: '이메일 발송 성공',
        });
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '이메일 발송 중 문제가 발생하였습니다.',
        });
    } finally {
        connection.release();
    }
};

const signupConfirm = async (req, res) => {
    console.log('signupConfirm');
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    const connection = await conn.getConnection();

    try {
        const existedEmail = await getUserByEmail(connection, email);

        if (!existedEmail) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: '해당하는 이메일이 존재하지 않습니다.',
            });
        }

        const isPasswordValid = await comparePassword(password, existedEmail.password);

        if (isPasswordValid) {
            const token = jwt.sign(
                {
                    id: existedEmail.id,
                    email: existedEmail.email,
                },
                process.env.TOKEN_PRIVATE_KEY,
                {
                    expiresIn: '1h',
                    issuer: process.env.TOKEN_ISSUER,
                }
            );
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });
            return res.status(StatusCodes.OK).json({
                message: '로그인 성공',
                token: token,
            });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: '비밀번호가 일치하지 않습니다.',
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '로그인 중 문제가 발생하였습니다.',
        });
    } finally {
        connection.release();
    }
};

const pwdResetRequest = async (req, res) => {
    const { email } = req.body;
    const connection = await conn.getConnection();

    try {
        const existedEmail = await getUserByEmail(connection, email);

        if (!existedEmail) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: '해당하는 이메일이 존재하지 않습니다.',
            });
        } else {
            return res.status(StatusCodes.OK).json({
                message: '이메일 발송 성공',
                email: email,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '이메일 발송 중 문제가 발생하였습니다.',
        });
    } finally {
        connection.release();
    }
};

const pwdReset = async (req, res) => {
    const connection = await conn.getConnection();
    const { email, password } = req.body;

    const hashedPwd = await hashPassword(password);

    const sqlUpdate = 'update users set password = ? where email = ?';

    const values = [hashedPwd, email];

    try {
        const existedEmail = await getUserByEmail(connection, email);

        if (!existedEmail) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: '해당하는 이메일이 존재하지 않습니다.',
            });
        }

        const isPasswordValid = await comparePassword(password, existedEmail.password);

        if (isPasswordValid) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: '새 비밀번호는 기존 비밀번호와 달라야 합니다.',
            });
        }

        const [rows] = await connection.query(sqlUpdate, values);

        if (rows.affectedRows > 0) {
            res.status(StatusCodes.OK).json({
                message: '비밀번호 초기화 성공',
            });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: '비밀번호 초기화 실패',
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '비밀번호 초기화 중 문제가 발생하였습니다.',
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    signupRequest,
    signupConfirm,
    signin,
    pwdResetRequest,
    pwdReset,
};
