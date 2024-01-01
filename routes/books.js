const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

router.use(express.json());

// 전체 도서 조회
router.get('/', (req, res) => {
    res.json({
        message: '전체 도서 조회',
    });
});

// 개별 도서 조회
router.get('/:id', (req, res) => {
    res.json({
        message: '개별 도서 조회',
    });
});

// 카테고리별 도서 목록 조회
router.get('/', (req, res) => {
    res.json({
        message: '카테고리별 도서 목록 조회',
    });
});

module.exports = router;
