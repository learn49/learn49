require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secret = process.env.APP_SECRET;

const verify = token => {
  return jwt.verify(token, secret);
};

const generateHash = data => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(data, salt);

  return hash;
};

const sign = payload => {
  return jwt.sign(payload, secret);
};

export {
  sign,
  generateHash,
  verify,
};
