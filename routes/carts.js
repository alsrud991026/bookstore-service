const express = require('express');
const router = express.Router();
const { addToCart, getCartItems, deleteCartItem } = require('../controller/cartController');
const { validatesAddToCart } = require('../middleware/cartValidator');
const verifyToken = require('../middleware/ensureAuthorization');

router.use(express.json());
/**
 * @swagger
 * /carts:
 *   post:
 *     summary: 장바구니에 도서 추가
 *     description: 장바구니에 도서를 추가합니다.
 *     tags: [Carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: 장바구니에 도서 추가 성공했을 때
 *         content:
 *           application/json:
 *             example:
 *               message: 장바구니에 도서가 추가되었습니다.
 *       200:
 *         description: 장바구니에 이미 도서가 담겨있을 때
 *         content:
 *           application/json:
 *             example:
 *               message: 이미 장바구니에 담긴 도서입니다. 원하시는 수량만큼 장바구니에 담긴 도서의 수량이 증가하였습니다.
 *       400:
 *         description: 존재하지 않는 유저일 때
 *         content:
 *           application/json:
 *             example:
 *               message: 존재하지 않는 유저입니다.
 *       404:
 *         description: 도서가 존재하지 않을 때
 *         content:
 *           application/json:
 *             example:
 *               message: 존재하지 않는 도서입니다.
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             example:
 *               message: 장바구니 추가 중 문제가 발생하였습니다.
 *
 *   get:
 *     summary: 장바구니 조회
 *     description: 장바구니를 조회합니다.
 *     tags: [Carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               selected:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: 장바구니 조회 성공했을 때
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 book_id: 123
 *                 title: 'Book Title'
 *                 summary: 'Book Summary'
 *                 quantity: 2
 *                 price: 20000
 *               - id: 2
 *                 book_id: 456
 *                 title: 'Another Book Title'
 *                 summary: 'Another Book Summary'
 *                 quantity: 1
 *                 price: 20000
 *       404:
 *         description: 장바구니에 담긴 도서가 없을 때
 *         content:
 *           application/json:
 *             example:
 *               message: '장바구니에 담긴 도서가 없습니다.'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             example:
 *               message: '장바구니 조회 중 문제가 발생하였습니다.'
 */
router
    .route('/')
    // 장바구니 담기
    .post(verifyToken, validatesAddToCart, addToCart)
    // 장바구니 조회, 선택된 장바구니 조회
    .get(verifyToken, getCartItems);

/**
 * @swagger
 * /carts/{id}:
 *   delete:
 *     summary: 장바구니 도서 삭제
 *     description: 장바구니 도서를 삭제합니다.
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 장바구니 도서 id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 장바구니 도서 삭제 성공했을 때
 *         content:
 *           application/json:
 *             example:
 *               message: '장바구니에서 도서가 삭제되었습니다.'
 *       404:
 *         description: 존재하지 않는 장바구니 도서일 때
 *         content:
 *           application/json:
 *             example:
 *               message: '존재하지 않는 장바구니 도서입니다.'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             example:
 *               message: '장바구니 도서 삭제 중 문제가 발생하였습니다.'
 */
// 장바구니 도서 삭제
router.delete('/:id', verifyToken, deleteCartItem);

module.exports = router;
