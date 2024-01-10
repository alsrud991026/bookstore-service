const express = require('express');
const router = express.Router();
const { addToCart, getCartItems, deleteCartItem } = require('../controller/CartController');
const { validatesAddToCart, validatesGetCartItems } = require('../middleware/CartMiddleware');

router.use(express.json());

// 장바구니 담기
router
    .route('/')
    .post(validatesAddToCart, addToCart)
    // 장바구니 조회
    .get(validatesGetCartItems, getCartItems);

// 장바구니 도서 삭제
router.delete('/:id', deleteCartItem);

// // 장바구니에서 선택한 주문 예상 상품 목록 조회
// router.get('/', (req, res) => {
//     res.json({
//         message: '장바구니에서 선택한 주문 예상 상품 목록 조회',
//     });
// });

module.exports = router;
