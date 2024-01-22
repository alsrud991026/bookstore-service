const express = require('express');
const router = express.Router();
const { order, getOrders, getOrderDetail, deleteOrder } = require('../controller/orderController');
const { verifyToken } = require('../middleware/ensureAuthorization');

router.use(express.json());

router
    .route('/')
    // 주문하기
    .post(verifyToken, order)
    // 주문 목록 조회
    .get(verifyToken, getOrders);

// 주문 상세 상품 조회
router
    .route('/:id')
    // 주문 상세 상품 조회
    .get(verifyToken, getOrderDetail)
    // 주문 취소
    .delete(verifyToken, deleteOrder);

module.exports = router;
