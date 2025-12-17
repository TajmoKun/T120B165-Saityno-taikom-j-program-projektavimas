const auth = require('../middleware/auth');
const db = require('../config/db');
const express = require('express');
const router = express.Router({mergeParams: true});
const suspended = require('../middleware/suspended')

router.get('/',async (req,res)=>{
try{
    const postId = req.params.postId;
    const subforumId = req.params.subforumId;
    if(!subforumId || !postId) return res.status(404).json({...postId,subforumId,message:"Subforum or Post ID doesnt exist"})
    const query = await db.query(`
        SELECT * FROM comments WHERE postid = $1
        `,[postId]);
    res.send(query.rows);
}catch(err)
{
    console.error(err);
    res.status(500).json({message: "Server Down"});
}
});


router.get('/:id',async (req,res)=>{
try{
    const postId = req.params.postId;
    const subforumId = req.params.subforumId;
    if(!subforumId || !postId) return res.status(404).json({...postId,subforumId,message:"Subforum or Post ID doesnt exist"})
        const query = await db.query(`
        SELECT * FROM comments WHERE id = $1
        `,[req.params.id]);
    if(query.rowCount === 0) {return res.status(404).json({message: "comment not found by such id"});}
    res.send(query.rows[0]);
}catch(err)
{
    console.error(err);
    res.status(500).json({message: "Server Down"});
}
});


router.post('/create',auth,suspended,async (req,res)=>{
try{
    const postId = req.params.postId;
    const subforumId = req.params.subforumId;
    if(!subforumId || !postId) return res.status(404).json({...postId,subforumId,message:"Subforum or Post ID doesnt exist"})
    const{content} = req.body;
    if(!content) return res.status(400).json({message:"Content is required"});
    const query = await db.query(`
        INSERT INTO comments (content,userid,postid) VALUES ($1,$2,$3) RETURNING *
        `,[content,req.user.id,postId]);
    if(query.rowCount === 0 ){
        return res.status(400).json({message: "Failed to create a comment"});
    }
    res.status(201).json({...query.rows[0], message:"Comment has been created"}); 

}catch(err)
{
    console.error(err);
    res.status(500).json({message: "Server Down"});
}

});


router.put('/edit/:id',auth,async (req,res)=>{
try{
    const postId = req.params.postId;
    const subforumId = req.params.subforumId;
    if(subforumId == null || postId == null) res.status(404).json({message:"Subforum or Post ID doesnt exist"})
    const {content} = req.body;
    const query = await db.query(`
            UPDATE comments
            SET content = $1, updatedat = CURRENT_TIMESTAMP
            WHERE id = $2 AND userid = $3 RETURNING *
        `,[content,req.params.id,req.user.id]);
    if(query.rowCount === 0 ){
        return res.status(404).json({message:"failed to update comment or you dont have access to this comment"});
    }
    res.status(200).json({...query.rows,message:"Comment edited successfuly"});
}catch(err)
{
    console.error(err);
    res.status(500).json({message: "Server Down"});
}
});


router.delete('/delete/:id',auth,async (req,res)=>{
try{
    const postId = req.params.postId;
    const subforumId = req.params.subforumId;
    if(subforumId == null || postId == null) res.status(404).json({message:"Subforum or Post ID doesnt exist"})
    const query = await db.query(`
        DELETE FROM comments WHERE id = $1 AND userid = $2 RETURNING *
        `,[req.params.id,req.user.id]);
    if(query.rowCount === 0){
        return res.status(403).json({message: "unauthorized access for deletion"});
    }
    res.status(204).send();
}catch(err)
{
    console.error(err);
    res.status(500).json({message: "Server Down"});
}

});

module.exports = router;