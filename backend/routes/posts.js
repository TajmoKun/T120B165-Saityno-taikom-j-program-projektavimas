const auth = require('../middleware/auth');
const db = require('../config/db');
const express = require('express');
const router = express.Router();

router.get('/:title', async (req,res)=>{
    try{
            const {subforumId} = req.body;   // yea ik, dont comment on it
            const query = await db.query(`
            SELECT * FROM posts WHERE subforumId = $1
            `,[subforumId]);
            res.send(query.rows);

    }catch(err){
        console.error(err);
        res.status(500).json({message: "boah, dis server is BROKEN!"});
    }
    
}); 

router.get('/:title/:id', async (req,res)=>{

    try{
        const {postId} = req.body;
        const query = await db.query(`
            SELECT * FROM posts WHERE id = $1
            `,[postId]);
        if(query.rowCount <= 0){
            return res.status(404).json({message: "*turns left* *turns right* dis place empty yo"});
        }
        res.send(query.rows);
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Yo server broken, yo server broken, cmon big boi come fix up yo server"});
    }

});

router.post('/create', auth, async(req,res)=>{
    try{
        const{subforumId, title, content} = req.body;
        const query = await db.query(`
            INSERT INTO posts (title,content,userid,subforumid,createdat)
            VALUES ($1,$2,$3,$4,CURRENT_TIMESTAMP) RETURNING *
            `,[title,content,req.user.id,subforumId]);
        res.status(201).json({...query.rows,message: "post has been created"});
    }catch(err){ 
        console.error(err);
        res.status(500).json({message:"insert funny quip bout the server being down"});
    }
});

router.delete('/delete/:id',auth,async(req,res)=>{
    try{
        const query = await db.query(`
            DELETE FROM posts WHERE id = $1 AND userId = $2 RETURNING *
            `,[req.params.id,req.user.id]);
        if(query.rowCount === 0){
            return res.status(404).json({message: "Hmm, trynna delete smt that dont exist, sooooo success?? or ur trynna delete someone elses post without permission"});
        }
        res.status(204).send();
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Yo server is DOOOOOOOWNN"});
    }
});

router.put('/edit/:id',auth,async(req,res)=>{
    try{
        const {title, content} = req.body;
        const query = await db.query(`
            UPDATE posts
            SET title = $1, content = $2, updatedat = CURRENT_TIMESTAMP
            WHERE id = $3 AND userid = $4
            `,[title,content, req.params.id, req.user.id]);
        if(query.rowCount === 0){
            return res.status(404).json({message: "Post doesnt exist or the post aint yours"});
        }
        res.status(204).json({...query.rows,message:"Post has been updated"});
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server error :/"});
    }
});

module.exports = router;