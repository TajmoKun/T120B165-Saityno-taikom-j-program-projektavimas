const db = require('../config/db');

module.exports = async function(req,res,next){
    try{
    const query = await db.query(`
            SELECT * FROM users WHERE id = $1
        `,[req.user.id]);

    if(query.rows[0].issuspended === true){
        return res.status(403).json({message: 'yer suspended sonny'})
    };
   
    next();
    }catch(err){
        console.error(err);
        res.status(500).json({message:"serve rerror"});
    }
}