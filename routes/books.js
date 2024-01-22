const express = require('express');
const router = express.Router();
const { allBooks, bookDetail } = require('../controller/bookController');
const { validatesGetBooks, validatesBooks } = require('../middleware/bookValidator');
const { verifyTokenOptional } = require('../middleware/ensureAuthorization');

router.use(express.json());

/**
 * @swagger
 * /books:
 *   get:
 *     summary: 전체 도서 조회
 *     description: 전체 도서를 조회합니다.
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: category_id
 *         description: 카테고리 아이디로 도서를 필터링합니다.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: news
 *         description: 신간 도서만 조회합니다.
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: limit
 *         description: 한 페이지에 보여줄 도서의 개수를 지정합니다.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: current_page
 *         description: 현재 페이지를 지정합니다.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 전체 도서 조회 성공
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 title: Book 1
 *                 img: 1
 *                 category_id: 1
 *                 form: ebook
 *                 isbn: 123456789
 *                 summary: Book 1 Summary
 *                 detail: Book 1 Detail
 *                 author: Author 1
 *                 pages: 100
 *                 contents: Book 1 Contents
 *                 price: 10000
 *                 pub_date: 2021-01-01
 *                 likes: 10
 *               - id: 2
 *                 title: Book 2
 *                 img: 2
 *                 category_id: 2
 *                 form: ebook
 *                 isbn: 987654321
 *                 summary: Book 2 Summary
 *                 detail: Book 2 Detail
 *                 author: Author 2
 *                 pages: 120
 *                 contents: Book 2 Contents
 *                 price: 20000
 *                 pub_date: 2023-12-12
 *                 likes: 16
 *       404:
 *         description: 해당하는 도서가 존재하지 않을 때 반환합니다.
 *         content:
 *           application/json:
 *             example:
 *               message: 해당하는 도서가 존재하지 않습니다.
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             example:
 *               message: 도서 조회 중 에러가 발생하였습니다.
 */
// 전체 도서 조회
router.get('/', validatesGetBooks, allBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: 개별 도서 조회
 *     description: 개별 도서를 조회합니다.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: 도서 아이디로 조회합니다.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: user_id
 *         description: 좋아요 여부를 확인할 사용자 아이디입니다.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user_id:
 *               type: integer
 *     responses:
 *       200:
 *         description: 개별 도서 조회 성공
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               title: Book 1
 *               img: 1
 *               category_id: 1
 *               form: ebook
 *               isbn: 123456789
 *               summary: Book 1 Summary
 *               detail: Book 1 Detail
 *               author: Author 1
 *               pages: 100
 *               contents: Book 1 Contents
 *               price: 10000
 *               pub_date: 2021-01-01
 *               category_name: IT
 *               likes: 10
 *               liked: true
 *       404:
 *         description: 해당하는 도서가 존재하지 않을 때 반환합니다.
 *         content:
 *           application/json:
 *             example:
 *               message: 해당하는 도서가 존재하지 않습니다.
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             example:
 *               message: 도서 조회 중 에러가 발생하였습니다.
 */
// 개별 도서 조회
router.get('/:id', verifyTokenOptional, validatesBooks, bookDetail);

module.exports = router;
