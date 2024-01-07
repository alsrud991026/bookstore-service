const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allCategory = (req, res) => {
    const sql = 'select * from category';

    conn.query(sql, (err, results) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: '서버 에러',
            });
        }

        if (results.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: '카테고리가 없습니다.',
            });
        }

        return res.status(StatusCodes.OK).json(results);
    });
};

module.exports = { allCategory };
