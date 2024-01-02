const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const { body, param, validationResult } = require('express-validator');
const crypto = require('crypto');

// 최소 영문자 하나, 숫자 하나, 특수문자 하나 이상의 8자 16자 사이의 비밀번호
const regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;

const validate = (req, res, next) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json(err.array());
    } else {
        return next();
    }
};

const validateEmail = body('email')
    .trim()
    .notEmpty()
    .withMessage('이메일을 입력하지 않았습니다.')
    .isEmail()
    .withMessage('이메일 형식이 아닙니다.');

const validatePwd = body('password')
    .trim()
    .notEmpty()
    .withMessage('비밀번호를 입력하지 않았습니다.')
    .matches(regex)
    .withMessage('비밀번호는 영문자, 숫자, 특수문자가 하나 이상 포함되며 8자에서 16자 사이여야 합니다.');

const validateName = body('name')
    .trim()
    .notEmpty()
    .withMessage('이름을 입력하지 않았습니다.')
    .isString()
    .withMessage('문자열로 입력해주세요.');

const validatesSignup = [validateEmail, validatePwd, validateName, validate];

const signup = (req, res) => {
    const { email, name, password } = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPwd = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    const sqlInsert = 'insert into users (email, name, password, salt) values (?, ?, ?, ?)';
    const sqlSelect = `select * from users where email = ?`;

    const values = [email, name, hashPwd, salt];

    conn.query(sqlSelect, email, function (err, results) {
        if (results.length > 0) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: '이미 존재하는 이메일입니다.',
            });
        } else {
            conn.query(sqlInsert, values, function (err, results) {
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
    res.json({
        message: '로그인',
    });
};

const pwdResetRequest = (req, res) => {
    res.json({
        message: '비밀번호 초기화 요청',
    });
};

const pwdReset = (req, res) => {
    res.json({
        message: '비밀번호 초기화',
    });
};

module.exports = { signup, signin, pwdResetRequest, pwdReset, validatesSignup };
