const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const checkauth =  async (req, res, next) => {
    const token = req.cookies.token;

    try {
        const decoded = jwt.verify(token,JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({message:"Unauthorized:user not found !"})
        }
        req.user = user; 
        next();
    } catch (error) {
        console.error("token error:",error);
        
        return res.status(401).json({ message: 'Token is invalid' });
    }
};

module.exports = checkauth;