const express = require('express');
const router = express.Router();
const { allCategory } = require('../controller/CategoryController');
router.use(express.json());

/**
 * @swagger
 * /category:
 *   get:
 *     summary: 카테고리 목록 조회
 *     description: 카테고리 목록을 조회합니다.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: 카테고리 목록 조회에 성공했을 때 응답합니다.
 *         content:
 *           application/json:
 *             example:
 *               - category_id: 1
 *                 category_name: Fiction
 *               - category_id: 2
 *                 category_name: Mystery
 *       404:
 *         description: 카테고리가 존재하지 않을 때 응답합니다.
 *         content:
 *           application/json:
 *             example:
 *               message: 카테고리가 존재하지 않습니다.
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             example:
 *               error: 카테고리 조회 중 에러가 발생하였습니다.
 */
router.get('/', allCategory);

module.exports = router;
