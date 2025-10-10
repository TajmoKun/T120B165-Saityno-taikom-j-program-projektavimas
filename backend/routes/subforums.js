const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/',async (req,res)=>{
    try{
        // gets the subforums with the forums creator user.
        const subForums = await db.query(`
            SELECT subforums.*, 
            users.username as creator_name,
            COUNT(DISTINCT posts.id) as post_count
            FROM subforums
            LEFT JOIN users ON subforums.userId = users.id
            LEFT JOIN posts ON posts.subforumId = subforums.id
            GROUP BY subforums.id, users.username
            ORDER BY subforums.createdAt DESC
            `);
            res.json(subForums.rows);
    }catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
});

// router.get('/',(req,res)=>{
//     res.json({message: "Route working subforms"});
// })

module.exports = router;