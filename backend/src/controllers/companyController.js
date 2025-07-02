const pool = require('../config/db')

exports.createCompany = async (req, res) => { // Insert new company
  const userId = req.user.userId
  const { name, description, industry } = req.body

  try {

    const check = await pool.query(
      'SELECT * FROM companies WHERE user_id = $1',
      [userId]
    )

    if (check.rows.length > 0) {
      return res.status(400).json({ error: 'Company already exists for this user' })
    }

    const result = await pool.query(
      `INSERT INTO companies (user_id, name, description, industry)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, name, description, industry]
    )

    res.status(201).json({
      message: 'Company created successfully',
      company: result.rows[0],
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create company' })
  }
}

exports.getMyCompany = async(req,res)=>{
    const userId = req.user.userId
    try{
        const result = await pool.query(
            'select * from companies where user_id = $1',[userId]
        )
        if(result.rows.length === 0){
            return res.status(404).json({
                error:'No Company profile found for this user'
            })
        }
        res.json({
            company: result.rows[0]
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            error:'Failed to fetch'
        })
    }

}
exports.updateCompany = async (req, res) => {
  const companyId = req.params.id
  const userId = req.user.userId
  const { name, description, industry, logo_url } = req.body

  try {
    // 1. Verify ownership
    const check = await pool.query(
      'SELECT * FROM companies WHERE id = $1 AND user_id = $2',
      [companyId, userId]
    )

    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own company' })
    }

    // 2. Update
    await pool.query(
      `UPDATE companies 
       SET name = $1, description = $2, industry = $3, logo_url = $4, updated_at = NOW()
       WHERE id = $5`,
      [name, description, industry, logo_url, companyId]
    )

    res.json({ message: 'Company updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update company' })
  }
}

exports.deleteCompany = async (req, res) => {
  const companyId = req.params.id
  const userId = req.user.userId

  try {
    // 1. Verify ownership
    const check = await pool.query(
      'SELECT * FROM companies WHERE id = $1 AND user_id = $2',
      [companyId, userId]
    )

    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own company' })
    }

    // 2. Delete
    await pool.query(
      'DELETE FROM companies WHERE id = $1',
      [companyId]
    )

    res.json({ message: 'Company deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete company' })
  }
}


exports.searchCompanies = async (req, res) => {
  const query = req.query.q

  if (!query) {
    return res.status(400).json({ error: 'Search query (q) is required' })
  }

  try {
    const result = await pool.query(
      `SELECT id, name, industry, description, logo_url
       FROM companies
       WHERE name ILIKE $1 OR industry ILIKE $1 OR description ILIKE $1`,
      [`%${query}%`]
    )

    res.json({ results: result.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Search failed' })
  }
}


