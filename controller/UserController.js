const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const getUserByEmail = async (connection, email) => {
    const selectEmail = 'select * from users where email = ?';

    const [rows] = await connection.query(selectEmail, email);
    return rows.length > 0 ? rows[0] : null;
};

const hashPassword = (password, salt) => {
    try {
        return crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');
    } catch (err) {
        console.log(err);
        throw new Error('비밀번호 암호화 중 문제가 발생하였습니다.');
    }
};

const signup = async (req, res) => {
    const connection = await conn.getConnection();

    const { email, name, password } = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashedPwd = hashPassword(password, salt);

    const sqlInsert = 'insert into users (email, name, password, salt) values (?, ?, ?, ?)';

    const values = [email, name, hashedPwd, salt];

    try {
        const existedEmail = await getUserByEmail(connection, email);
        if (existedEmail) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: '이미 존재하는 이메일입니다.',
            });
        }

        const [rows] = await connection.query(sqlInsert, values);

        if (rows.affectedRows > 0) {
            res.status(StatusCodes.CREATED).json({
                message: '회원가입 성공',
            });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: '회원가입 실패',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: '회원가입 중 문제가 발생하였습니다.',
        });
    } finally {
        connection.release();
    }
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

        const hashedPwd = hashPassword(password, existedEmail.salt);

        if (hashedPwd === existedEmail.password) {
            const token = jwt.sign(
                {
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

    const salt = crypto.randomBytes(10).toString('base64');
    const hashedPwd = hashPassword(password, salt);

    const sqlUpdate = 'update users set password = ?, salt = ? where email = ?';

    const values = [hashedPwd, salt, email];

    try {
        const existedEmail = await getUserByEmail(connection, email);

        if (!existedEmail) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: '해당하는 이메일이 존재하지 않습니다.',
            });
        }

        const hashedNewPassword = hashPassword(password, existedEmail.salt);

        if (hashedNewPassword === existedEmail.password) {
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
    signup,
    signin,
    pwdResetRequest,
    pwdReset,
};
