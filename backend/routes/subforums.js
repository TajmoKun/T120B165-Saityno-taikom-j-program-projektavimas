const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const suspended = require('../middleware/suspended')
router.get('/',async (req,res)=>{
    try{
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
            res.json(subForums.rows)
    }catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/:id', async (req,res)=>{
    try{
        const subForum = await db.query(`
            SELECT subforums.*, 
            users.username as creator_name
            FROM subforums
            LEFT JOIN users ON subforums.userId = users.id
            WHERE subforums.id = $1
            `,[req.params.id]);

            if(subForum.rows.length === 0){
                return res.status(404).json({message: "Me see no subforum by that id"});
            }

            res.json(subForum.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).send('Server error, bruh');
    }
});

router.post('/create',auth,suspended, async (req,res)=>{
    try{
        const { title, description} = req.body;
            if(!title || !description){
                return res.status(400).json({message: "Where mah title & description at?!?!"});
            }
        const isTitleUnique = await db.query(`
            SELECT subforums.title FROM subforums WHERE subforums.title = $1
            `,[title]);
        if(isTitleUnique.rows.length > 0) return res.status(409).json({message: "This subforum title has already been taken"});
        const query = await db.query(
            `INSERT INTO subforums (title, description, userid, createdat) VALUES ($1,$2,$3,CURRENT_TIMESTAMP) RETURNING *`,
            [title,description,req.user.id]
        );
        res.status(201).json({...query.rows[0], message: 'created la subforum'});
    }catch(err){
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.delete('/delete/:id',auth,suspended,async(req,res)=>{
    try{
        const query = await db.query(`
            DELETE FROM subforums WHERE subforums.id = $1 AND subforums.userId = $2
            `,[req.params.id,req.user.id]);
        if(query.rowCount === 0){
            return res.status(404).json({message: "nthin was deleted, either auth problem or no entry to delete"});
        }
        res.status(204).send();
    }catch(err){
        console.error(err);
        res.status(500).send('la server broke');
    }
})

router.put('/edit/:id',auth,suspended,async(req,res)=>{
    try{
        const {title, description} = req.body;
        if(!title || !description) {return res.status(400).json({message: "Yo, ya gotta put smt in for title and description to edit"});}
        const query = await db.query(`
            UPDATE subforums
            SET title = $1, description = $2
            WHERE subforums.id = $3 AND subforums.userId = $4
            `,[title, description, req.params.id, req.user.id]);
        if(query.rowCount === 0 ){
            return res.status(404).json({message:"La entry has not been found or you're trynna edit someone elses subforum, not cool"});
        }
        res.status(200).json({message:"la subredit has been updated"});
    }catch(err){
        console.error(err);
        res.status(500).send("hello, la server has broken");
    }   
});

module.exports = router;