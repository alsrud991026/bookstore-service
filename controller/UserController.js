const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const signup = (req, res) => {
    const { email, name, password } = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPwd = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    const sqlInsert = 'insert into users (email, name, password, salt) values (?, ?, ?, ?)';
    const sqlSelect = `select * from users where email = ?`;

    const values = [email, name, hashPwd, salt];

    conn.query(sqlSelect, email, (err, results) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: '서버 에러',
            });
        }

        if (results.length > 0) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: '이미 존재하는 이메일입니다.',
            });
        } else {
            conn.query(sqlInsert, values, (err, results) => {
                if (err) {
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: '서버 에러',
                    });
                }

                if (results.affectedRows > 0) {
                    res.status(StatusCodes.CREATED).json({
                        message: '회원가입 성공',
                    });
                } else {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: '회원가입 실패',
                    });
                }
            });
        }
    });
};

const signin = (req, res) => {
    const { email, password } = req.body;
    const sql = 'select * from users where email = ?';

    conn.query(sql, email, (err, results) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: '서버 에러',
            });
        }

        const signinUser = results[0];

        if (!signinUser) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: '해당하는 이메일이 존재하지 않습니다.',
            });
        }

        try {
            const hashedPassword = crypto.pbkdf2Sync(password, signinUser.salt, 10000, 10, 'sha512').toString('base64');

            if (hashedPassword === signinUser.password) {
                const token = jwt.sign(
                    {
                        email: signinUser.email,
                    },
                    process.env.PRIVATE_KEY,
                    {
                        expiresIn: '1h',
                        issuer: 'minkyung',
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
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: '비밀번호 해싱 중 문제가 발생하였습니다.',
            });
        }
    });
};

const pwdResetRequest = (req, res) => {
    const { email } = req.body;
    const sql = 'select * from users where email = ?';

    conn.query(sql, email, (err, results) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: '서버 에러',
            });
        }

        const user = results[0];

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: '해당하는 이메일이 존재하지 않습니다.',
            });
        } else {
            return res.status(StatusCodes.OK).json({
                message: '이메일 발송 성공',
                email: email,
            });
        }
    });
};

const pwdReset = (req, res) => {
    const { email, password } = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPwd = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    const sqlUpdate = 'update users set password = ?, salt = ? where email = ?';
    const sqlSelect = 'select * from users where email = ?';
    const values = [hashPwd, salt, email];

    conn.query(sqlSelect, email, (err, results) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: '서버 에러',
            });
        }

        const user = results[0];

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: '해당하는 이메일이 존재하지 않습니다.',
            });
        }

        const hashedNewPassword = crypto.pbkdf2Sync(password, user.salt, 10000, 10, 'sha512').toString('base64');

        if (hashedNewPassword === user.password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: '새 비밀번호는 기존 비밀번호와 달라야 합니다.',
            });
        }

        conn.query(sqlUpdate, values, (err, results) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: '서버 에러',
                });
            }

            if (results.affectedRows > 0) {
                res.status(StatusCodes.OK).json({
                    message: '비밀번호 초기화 성공',
                });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: '비밀번호 초기화 실패',
                });
            }
        });
    });
};

module.exports = {
    signup,
    signin,
    pwdResetRequest,
    pwdReset,
};
