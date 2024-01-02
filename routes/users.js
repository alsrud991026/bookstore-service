const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const { signup, signin, pwdResetRequest, pwdReset, validatesSignup } = require('../controller/UserController');

router.use(express.json());

// 회원가입
router.post('/signup', validatesSignup, signup);

// 로그인
router.post('/signin', signin);

router
    .route('/reset')
    // 비밀번호 초기화 요청
    .post(pwdResetRequest)
    // 비밀번호 초기화
    .put(pwdReset);

module.exports = router;
