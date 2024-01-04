const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { allBooks, bookDetail, booksByCategory } = require('../controller/BookController');

router.use(express.json());

// 전체 도서 조회
router.get('/', allBooks);

// 개별 도서 조회
router.get('/:id', bookDetail);

// 카테고리별 도서 목록 조회
router.get('/', booksByCategory);

module.exports = router;
