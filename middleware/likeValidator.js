const { param, body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
        return res.status(400).json(err.array());
    } else {
        return next();
    }
};

const validateLikedBookId = param('id')
    .trim()
    .notEmpty()
    .withMessage('도서 아이디를 입력해주세요.')
    .isInt()
    .withMessage('숫자로 입력해주세요.');

const validateUserId = body('user_id')
    .trim()
    .notEmpty()
    .withMessage('유저 아이디를 입력해주세요.')
    .isInt()
    .withMessage('숫자로 입력해주세요.');

const validatesLike = [validateLikedBookId, validateUserId, validate];

module.exports = { validatesLike };
