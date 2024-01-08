const express = require('express');
const router = express.Router();
const { addLike, deleteLike } = require('../controller/LikeController');

router.use(express.json());

// 좋아요 추가
router
    .route('/:id')
    .post(addLike)
    // 좋아요 취소
    .delete(deleteLike);

module.exports = router;
