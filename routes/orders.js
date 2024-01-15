const express = require('express');
const router = express.Router();
const { order, getOrders, getOrderDetail, deleteOrder } = require('../controller/OrderController');

router.use(express.json());

router
    .route('/')
    // 주문하기
    .post(order)
    // 주문 목록 조회
    .get(getOrders);

// 주문 상세 상품 조회
router
    .route('/:id')
    // 주문 상세 상품 조회
    .get(getOrderDetail)
    // 주문 취소
    .delete(deleteOrder);

module.exports = router;
