const express = require('express');
const router = express.Router();
const { addLike, deleteLike } = require('../controller/likeController');
const { validatesLike } = require('../middleware/likeValidator');
const { verifyToken } = require('../middleware/ensureAuthorization');

router.use(express.json());

/**
 * @swagger
 * /books/{id}:
 *   post:
 *     summary: 좋아요 추가
 *     description: 도서에 좋아요를 추가합니다.
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 도서 ID
 *         schema:
 *           type: integer
 *       - in: body
 *         name: requestBody
 *         required: true
 *         description: 유저 ID
 *         schema:
 *           type: object
 *           properties:
 *             user_id:
 *               type: integer
 *     responses:
 *       200:
 *         description: 좋아요 추가에 성공했을 때
 *         content:
 *           application/json:
 *             example:
 *               message: 좋아요 성공
 *       400:
 *         description: 이미 좋아요한 도서에 좋아요를 추가하려고 할 때
 *         content:
 *           application/json:
 *             example:
 *               message: 이미 좋아요한 책입니다.
 *       404:
 *         description: 도서나 유저가 존재하지 않을 때
 *         content:
 *           application/json:
 *             example:
 *               message: 존재하지 않는 유저입니다.
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             example:
 *               message: 서버 에러
 *   delete:
 *     summary: 좋아요 취소
 *     description: 도서에 좋아요를 취소합니다.
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 도서 ID
 *         schema:
 *           type: integer
 *       - in: body
 *         name: requestBody
 *         required: true
 *         description: 유저 ID
 *         schema:
 *           type: object
 *           properties:
 *             user_id:
 *               type: integer
 *     responses:
 *       200:
 *         description: 좋아요 취소에 성공했을 때
 *         content:
 *           application/json:
 *             example:
 *               message: 좋아요 취소 성공
 *       400:
 *         description: 좋아요하지 않은 도서에 좋아요를 취소하려고 할 때
 *         content:
 *           application/json:
 *             example:
 *               message: 좋아요하지 않은 책입니다.
 *       404:
 *         description: 도서나 유저가 존재하지 않을 때
 *         content:
 *           application/json:
 *             example:
 *               message: 존재하지 않는 유저입니다.
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             example:
 *               message: 서버 에러
 */
router
    .route('/:id')
    // 좋아요 추가
    .post(verifyToken, validatesLike, addLike)
    // 좋아요 취소
    .delete(verifyToken, validatesLike, deleteLike);

module.exports = router;
