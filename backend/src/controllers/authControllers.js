const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

exports.signup = async (req, res) => {
    const {email,password} = req.body 
    try{
        const existing = await pool.query('SELECT * FROM users where email = $1',[email])
        if(existing.rows.length>0){
            return res.status(400).json({
                error:'User already exist'
            })
        }

        const hashed = await bcrypt.hash(password,10)

        const result = await pool.query(
            'INSERT INTO users (email,password_hash) VALUES ($1,$2) RETURNING id, email', [email,hashed]
        )
        res.status(201).json({
            message:'User Created Successfully',
            user: result.rows[0]
        })
    }catch(err){
        console.error(err)
        res.status(500).json({
            error:'Server Error'
        })
    }
};


exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    if (!user.password_hash) {
      console.error('User found but password_hash is missing')
      return res.status(500).json({ error: 'User record is corrupted' })
    }

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.json({ token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
