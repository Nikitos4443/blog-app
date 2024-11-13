/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');

module.exports = function(req, res, next) {

  const authorizationHeader = req.headers['authorization'];
  const accessToken = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
  const refreshToken = req.cookies['refreshToken']

  if (!accessToken && !refreshToken) {
    return res.status(401).send('Access Denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(accessToken, secret);
    req.user = decoded.user;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send('Access Denied. No refresh token provided.');
    }

    try {
      const decoded = jwt.verify(refreshToken, secret);
      const accessToken = jwt.sign({ user: decoded.user }, secret, { expiresIn: '1h' });
      res
        .cookie('refreshToken', refreshToken)
        .header('Authorization', accessToken)
        next()
    } catch (error) {
      return res.status(400).send('Invalid Token.')
    }
  }
};
