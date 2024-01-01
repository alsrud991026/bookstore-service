const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

router.use(express.json());

// 좋아요 추가
router
    .route('/:id')
    .post((req, res) => {
        res.json({
            message: '좋아요 추가',
        });
    })
    // 좋아요 취소
    .delete((req, res) => {
        res.json({
            message: '좋아요 취소',
        });
    });

module.exports = router;
