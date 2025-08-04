const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const setTokenCookie = (res, token) => {
  const options = {
    httpOnly: true,
    secure: false,
    sameSite:'lax',
    domain: 'localhost',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 //7d
  };
  res.cookie('token', token, options);
};

module.exports = { generateToken, setTokenCookie };