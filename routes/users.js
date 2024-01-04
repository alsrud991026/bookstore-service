const express = require('express');
const router = express.Router();
const { signup, signin, pwdResetRequest, pwdReset } = require('../controller/UserController');

const { validatesSignup, validatesSignin, validatesEmail } = require('../middleware/UserMiddleware');

router.use(express.json());

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: "회원가입 요청"
 *     description: "이메일, 비밀번호, 이름을 입력받아 회원가입을 요청합니다."
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test2@gmail.com"
 *               password:
 *                 type: string
 *                 example: "1234abcd!"
 *               name:
 *                 type: string
 *                 example: "홍길동"
 *     responses:
 *       "201":
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원가입 성공"
 *       "401":
 *         description: 회원가입 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원가입 실패"
 */

router.post('/signup', validatesSignup, signup);

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: "로그인 요청"
 *     description: "이메일과 비밀번호를 입력받아 로그인을 요청합니다."
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@gmail.com"
 *               password:
 *                 type: string
 *                 example: "1234abcd!"
 *     responses:
 *       "200":
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인 성공"
 *                 token:
 *                   type: string
 *                   description: "인증 토큰"
 *       "401":
 *         description: 로그인 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인 실패"
 */

router.post('/signin', validatesSignin, signin);

/**
 * @swagger
 * /users/reset:
 *   post:
 *     summary: "비밀번호 재설정 요청"
 *     description: "이메일을 입력받아 비밀번호 재설정을 요청합니다."
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@gmail.com"
 *     responses:
 *       "200":
 *         description: 비밀번호 재설정 요청 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이메일 발송 성공"
 *                 email:
 *                   type: string
 *       "401":
 *         description: 비밀번호 재설정 요청 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이메일 발송 실패"
 *   put:
 *     summary: "비밀번호 재설정"
 *     description: "이메일과 새로운 비밀번호를 입력받아 비밀번호를 재설정합니다."
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@gmail.com"
 *               password:
 *                 type: string
 *                 example: "newPassword123!"
 *     responses:
 *       "200":
 *         description: 비밀번호 재설정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "비밀번호 재설정 성공"
 *       "400":
 *         description: 비밀번호 재설정 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "새 비밀번호는 기존 비밀번호와 달라야 합니다."
 *       "401":
 *         description: 비밀번호 재설정 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "해당하는 이메일이 존재하지 않습니다."
 */

router
    .route('/reset')
    // 비밀번호 초기화 요청
    .post(validatesEmail, pwdResetRequest)
    // 비밀번호 초기화
    .put(validatesSignin, pwdReset);

module.exports = router;
