
require('dotenv').config();

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (id) => {
    const token = jwt.sign({id: id}, JWT_SECRET);
    return token;
}

module.exports = generateToken;
