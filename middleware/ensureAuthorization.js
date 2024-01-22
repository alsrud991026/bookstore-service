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
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
            });
        } else if (err instanceof jwt.JsonWebTokenError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: '유효하지 않은 토큰입니다.',
            });
        } else {
            console.log(err);
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: '로그인이 필요합니다.',
            });
        }
    }
};

module.exports = verifyToken;
