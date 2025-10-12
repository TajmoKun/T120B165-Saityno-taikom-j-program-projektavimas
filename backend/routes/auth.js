const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const auth = require('../middleware/auth');
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

    const genToken = {
        user:{
            id: result.rows[0].id
        }
    };

    jwt.sign(
        genToken,
        process.env.JWT_SECRET,
        {expiresIn: '1h'},
        (err,token) =>{
            if(err) throw err;
            res.json({token});
        }
    );
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server oopsies");
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

        const genToken = {
            user:{
                id: user.id
            }
        };
        jwt.sign(
            genToken,
            process.env.JWT_SECRET,
            {expiresIn: '1h'},
            (err,token) =>{
                if(err) throw err;
                res.json({token});
            }
        );
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;