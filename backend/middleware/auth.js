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
        console.log('Token decoded:', {
            userId: decoded.user.id,
            issuedAt: new Date(decoded.iat * 1000),
            expiresAt: new Date(decoded.exp * 1000),
            timeNow: new Date(),
            expired: decoded.exp < Date.now() / 1000
        });
        next();
    }catch(err){
        res.status(401).json({message: 'Token aint valid yo'});
    }
}