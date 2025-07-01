const express = require('express')
const { signup, login } = require('../controllers/authControllers')
const verifyToken = require('../middlewares/verifyToken')
const router = express.Router()
const pool = require('../config/db')


router.post('/signup',signup)
router.post('/login',login)
router.get('/me',verifyToken,async(req,res)=>{
    const userId = req.user.userId
    try {
       const result = await pool.query(
        'SELECT id,email from users where id = $1',[userId]
       ) 
       const user = result.rows[0]
       res.json({user})
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error:'Failed to fetch user info'
        })        
    }
})

module.exports = router