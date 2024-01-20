const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'] || req.headers['Authorization'];
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: '로그인이 필요합니다.',
        });
    }

    try {
        const decodedJwt = jwt.verify(token, process.env.TOKEN_PRIVATE_KEY);
        req.userId = decodedJwt.id;
        next();
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: '로그인이 필요합니다.',
        });
    }
};

module.exports = verifyToken;
