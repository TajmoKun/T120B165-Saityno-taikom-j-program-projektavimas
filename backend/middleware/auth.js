const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req,res,next){
    const token = req.header('x-auth-token');

    if(!token){
        return res.status(401).json({message : 'no token no auth'});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        req.shitter = decoded.user;
        next();
    }catch(err){
        res.status(401).json({message: 'Token aint valid yo'});
    }
}