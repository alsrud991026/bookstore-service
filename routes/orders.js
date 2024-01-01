const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

router.use(express.json());

// 주문하기
router
    .route('/')
    .post((req, res) => {
        res.json({
            message: '주문하기',
        });
    })
    // 주문 목록 조회
    .get((req, res) => {
        res.json({
            message: '주문 목록 조회',
        });
    });

// 주문 상세 상품 조회
router.get('/:id', (req, res) => {
    res.json({
        message: '주문 상세 상품 조회',
    });
});

module.exports = router;
