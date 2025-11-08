const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const auth = require('../middleware/auth');
const{
    generateAccessToken,
    generateRefreshToken,
    saveRefreshToken,
    verifyRefreshToken,
    deleteAllusersRefreshTokens,
    deleteRefreshToken,
    cleanupExpiredTokens
} = require('../utils/tokenHelper');
const { stripTypeScriptTypes } = require('module');

require('dotenv').config();

router.post('/register', async(req,res) =>{
    try{
    const {username,email,password} = req.body;

    if(!username || !email || !password){
        return res.send(401).json({
            message: "Enter all of the neccessary credentials"
        });
    }
    const isUniqueUser = await db.query(
        'SELECT * FROM users WHERE email = $1 OR username = $2', [email,username]
    );
    if(isUniqueUser.rows.length > 0){
        return res.status(400).json({message: "User with the name or email already exists"});
    }
 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const result = await db.query(
        'INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id', 
        [username,email,hashedPassword]
    );

    const userId = result.rows[0].id;

    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    await saveRefreshToken(userId,refreshToken);
    
    res.json({
        accessToken,
        refreshToken,
        expiresIn: '15m',
        user:{
            id:user.id,
            username: user.username,
            email: user.email
        }
    });
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server oopsies");
    }
});

router.post('/refresh',async(req,res)=>{
    try{
        const {refreshToken} = req.body;
        if(!refreshToken){
            return res.status(401).json({message: 'Refresh token needed'});
        }
        const userId = await verifyRefreshToken(refreshToken);
        if(!userId){
            return res.status(403).json({message: 'invalid refresh token'});
        }
        const newAccessToken = generateAccessToken(userId);
        const newRefreshToken = generateRefreshToken(userId);

        await deleteRefreshToken(refreshToken);
        await saveRefreshToken(userId,newRefreshToken);

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresIn: '15m'
        });
    }catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post('/login',async (req,res)=> {
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: 'Missing input of email or password'});
        }

        const result = await db.query(
            'SELECT * FROM users WHERE email = $1', [email]
        );

        if(result.rows.length == 0){
            return res.status(400).json({message: "User with this email is not registered"})
        }

        const user = result.rows[0];

        const checkIfCorrectPassword = await bcrypt.compare(password, user.password);

        if(!checkIfCorrectPassword){
            return res.status(400).json({message: "Password is not correct"});
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        await saveRefreshToken(user.id,refreshToken);

        res.json({
            accessToken,
            refreshToken,
            expiresIn: '15m',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
    });
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post('/logout',auth,async(req,res)=>{
    try{
        const{refreshToken} = req.body;
        if(refreshToken){
            await deleteRefreshToken(refreshToken);
        }
        res.json({message: "Logged out"});
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post('/logout-all', auth, async (req, res) => {
    try {
        await deleteAllUserRefreshTokens(req.user.id);
        res.json({ message: 'Logged out from all devices' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


module.exports = router;