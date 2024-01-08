const express = require('express');
const router = express.Router();
const { allBooks, bookDetail } = require('../controller/BookController');
const { validatesGetBooks, validatesBooks } = require('../middleware/BookMiddleware');

router.use(express.json());

// 전체 도서 조회
router.get('/', validatesGetBooks, allBooks);

// 개별 도서 조회
router.get('/:id', validatesBooks, bookDetail);

module.exports = router;
