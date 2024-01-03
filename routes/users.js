const express = require('express');
const router = express.Router();
const {
    signup,
    signin,
    pwdResetRequest,
    pwdReset,
    validatesSignup,
    validatesSignin,
    validateEmail,
} = require('../controller/UserController');

router.use(express.json());

// 회원가입
router.post('/signup', validatesSignup, signup);

// 로그인
router.post('/signin', validatesSignin, signin);

router
    .route('/reset')
    // 비밀번호 초기화 요청
    .post(validateEmail, pwdResetRequest)
    // 비밀번호 초기화
    .put(validatesSignin, pwdReset);

module.exports = router;
