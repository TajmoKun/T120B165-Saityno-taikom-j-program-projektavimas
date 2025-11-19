const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const suspended = require('../middleware/suspended')
const admin = require('../middleware/admin')

router.post('/suspend/:id',auth,admin,async (req,res)=>{
    try {
        const userId = req.params.id;
        const userCheck = await db.query(
            `SELECT * FROM users WHERE id = $1`,
            [userId]
        );
        
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (userCheck.rows[0].issuspended) {
            return res.status(400).json({ message: 'User is already suspended' });
        }
        
        const result = await db.query(
            `UPDATE users SET issuspended = true WHERE id = $1 RETURNING id, username, issuspended`,
            [userId]
        );
        res.json({ 
            message: 'User has been suspended',
            user: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/unsuspend/:id',auth,admin,async (req,res)=>{
     try {
        const userId = req.params.id;
        
        const userCheck = await db.query(
            `SELECT * FROM users WHERE id = $1`,
            [userId]
        );
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!userCheck.rows[0].issuspended) {
            return res.status(400).json({ message: 'User is not suspended' });
        }
        
        const result = await db.query(
            `UPDATE users SET issuspended = false WHERE id = $1 RETURNING id, username, issuspended`,
            [userId]
        );
        
        res.json({ 
            message: 'User has been unsuspended',
            user: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;