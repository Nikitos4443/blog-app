const jwt = require('jsonwebtoken');
const secret = require('../config/secret');

const getTokens = (user) => {
    const payload = {
        user: {
            id: user.id,
            email: user.email,
        }
    };

    const accessToken = jwt.sign(payload, secret, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, secret, { expiresIn: '1d' });

    return {accessToken, refreshToken};
}

module.exports =  getTokens;