const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allCategory = async (req, res) => {
    const connection = await conn.getConnection();
    const sql = 'select * from category';

    try {
        const [rows] = await connection.query(sql);

        if (rows.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: '카테고리가 없습니다.',
            });
        }

        return res.status(StatusCodes.OK).json(rows);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: '카테고리 조회 중 에러가 발생하였습니다.',
        });
    } finally {
        connection.release();
    }
};

module.exports = { allCategory };
