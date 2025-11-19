const db = require('../config/db');

module.exports = async function(req,res,next){
    try{
        const result = await db.query(`
            SELECT * FROM users WHERE id=$1
            `,[req.user.id]);
        if(result.rows.length === 0){
            return res.status(404).json({message:"user not fonund"});
        }
        if(result.rows[0].role !== 'admin'){
            return res.status(403).json({message: "Who do you think youu are trynna get here without admin status?!"});
        }
        next();
    }catch(err){
        comsole.error(err);
        res.status(500).json({message:'server error'});
    }
}