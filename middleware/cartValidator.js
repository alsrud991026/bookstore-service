const { param, body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
        return res.status(400).json(err.array());
    } else {
        return next();
    }
};

const validateBookId = body('book_id')
    .trim()
    .notEmpty()
    .withMessage('도서 아이디를 입력해주세요.')
    .isInt()
    .withMessage('숫자로 입력해주세요.');

const validateQuantity = body('quantity')
    .trim()
    .notEmpty()
    .withMessage('수량을 입력해주세요.')
    .isInt()
    .withMessage('숫자로 입력해주세요.')
    .custom((value) => value > 0)
    .withMessage('수량은 1 이상이어야 합니다.');

const validatesAddToCart = [validateBookId, validateQuantity, validate];

module.exports = { validatesAddToCart };
