const { verify } = require('jsonwebtoken');
const cookie = require('cookie');

function auth(req, res, next) {
    const token = getTokenFromCookie(req);
    if (!token) {
        return res.status(401).setHeader('Location', '/login').send({
            status: "1",
            message: "Unauthorized: Token not found"
        });
    }

    try {
        const verified = verify(token, process.env.TOKEN_KEY);
        req.user = verified;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).setHeader('Location', '/login').send({
            status: "1",
            message: "Unauthorized: Invalid token"
        });
    }
}

function getTokenFromCookie(req) {
    const cookies = cookie.parse(req.headers.cookie || '');
    return cookies.token;
}

module.exports = { auth };
