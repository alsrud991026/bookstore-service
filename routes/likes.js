const express = require('express');
const router = express.Router();
const { addLike, deleteLike } = require('../controller/LikeController');
const { validatesLike } = require('../middleware/LikeMiddleware');

router.use(express.json());

router
    .route('/:id')
    // 좋아요 추가
    .post(validatesLike, addLike)
    // 좋아요 취소
    .delete(validatesLike, deleteLike);

module.exports = router;
