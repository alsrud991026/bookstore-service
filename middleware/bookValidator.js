const { param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
        return res.status(400).json(err.array());
    } else {
        return next();
    }
};

const validateCategoryId = query('category_id')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('카테고리 아이디를 입력해주세요.')
    .isInt()
    .withMessage('숫자로 입력해주세요.');

const validateBookId = param('id')
    .trim()
    .notEmpty()
    .withMessage('도서 아이디를 입력해주세요.')
    .isInt()
    .withMessage('숫자로 입력해주세요.');

const validateNews = query('news')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('신간 여부를 입력해주세요.')
    .isBoolean()
    .withMessage('true 또는 false로 입력해주세요.');

const validateLimit = query('limit')
    .trim()
    .notEmpty()
    .withMessage('페이지 당 도서 수를 입력해주세요.')
    .isInt()
    .withMessage('숫자로 입력해주세요.')
    .custom((value) => value > 0)
    .withMessage('페이지 당 도서 수는 1 이상이어야 합니다.');

const validateCurrentPage = query('current_page')
    .trim()
    .notEmpty()
    .withMessage('현재 페이지를 입력해주세요.')
    .isInt()
    .withMessage('숫자로 입력해주세요.')
    .custom((value) => value > 0)
    .withMessage('현재 페이지는 1 이상이어야 합니다.');

const validatesGetBooks = [validateCategoryId, validateNews, validateLimit, validateCurrentPage, validate];
const validatesBooks = [validateBookId, validate];

module.exports = { validatesGetBooks, validatesBooks };
