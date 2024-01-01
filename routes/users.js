const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

router.use(express.json());

// 회원가입
router.post('/signup', (req, res) => {
    res.json({
        message: '회원가입',
    });
});

// 로그인
router.post('/signin', (req, res) => {
    res.json({
        message: '로그인',
    });
});

router
    .route('/reset')
    // 비밀번호 초기화 요청
    .post((req, res) => {
        res.json({
            message: '비밀번호 초기화 요청',
        });
    })
    // 비밀번호 초기화
    .put((req, res) => {
        res.json({
            message: '비밀번호 초기화',
        });
    });

module.exports = router;
