const db = require('../config/db');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/contacts',auth, async (req,res) =>{
    try{
            const query = await db.query(`
        SELECT 
        users.id,
        users.username
        FROM users
        WHERE users.id IN (
        SELECT senderid FROM messages WHERE receiverid = $1
        UNION
        SELECT receiverid FROM messages WHERE senderid = $1
        )
        ORDER BY users.username;
        `,[req.user.id]);
        res.status(200).send(query.rows);
    }catch(err){
        console.error(err);
        res.status(500).json({message:"server error"});
    }
});

router.get('/chatlogs/:friendsid',auth,async(req,res)=>{
    try{
        const query = await db.query(`
            SELECT
            messages.*
            FROM messages
            WHERE 
            (senderid = $1 AND receiverid = $2)
            OR
            (senderid = $2 AND receiverid = $1)
            ORDER BY messages.datesent;
            `,[req.params.friendsid,req.user.id]);
            res.status(200).send(query.rows);
    }catch(err){
        console.error(err);
        res.status(500).json({message:"server error"});
    }

});



module.exports = router;
