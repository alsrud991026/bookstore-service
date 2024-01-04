const { body, param, validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

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
const validatesSignin = [validateEmail, validatePwd, validate];
const validatesEmail = [validateEmail, validate];

module.exports = { validatesSignup, validatesSignin, validatesEmail };
