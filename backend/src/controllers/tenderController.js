const pool = require('../config/db')

exports.createTender = async (req, res) => {
  const userId = req.user.userId
  const { title, description, budget, deadline } = req.body

  try {
    const companyResult = await pool.query(
      'SELECT id FROM companies WHERE user_id = $1',
      [userId]
    )

    if (companyResult.rows.length === 0) {
      return res.status(403).json({ error: 'Company not found for user' })
    }

    const companyId = companyResult.rows[0].id

    const result = await pool.query(
      'INSERT INTO tenders (title, description, budget, deadline, user_id, company_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, budget, deadline, userId, companyId]
    )

    res.status(201).json({ tender: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create tender' })
  }
}

exports.getMyTenders = async (req, res) => {
  const userId = req.user.userId
  try {
    const result = await pool.query(
      'SELECT * FROM tenders WHERE user_id = $1',
      [userId]
    )
    res.json({ tenders: result.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch tenders' })
  }
}

exports.updateTender = async (req, res) => {
  const userId = req.user.userId
  const tenderId = req.params.id
  const { title, description, budget, deadline } = req.body

  try {
    const check = await pool.query(
      'SELECT * FROM tenders WHERE id = $1 AND user_id = $2',
      [tenderId, userId]
    )

    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to update this tender' })
    }

    const result = await pool.query(
      'UPDATE tenders SET title = $1, description = $2, budget = $3, deadline = $4 WHERE id = $5 RETURNING *',
      [title, description, budget, deadline, tenderId]
    )

    res.json({ tender: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update tender' })
  }
}

exports.deleteTender = async (req, res) => {
  const userId = req.user.userId
  const tenderId = req.params.id

  try {
    const check = await pool.query(
      'SELECT * FROM tenders WHERE id = $1 AND user_id = $2',
      [tenderId, userId]
    )

    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to delete this tender' })
    }

    await pool.query('DELETE FROM tenders WHERE id = $1', [tenderId])
    res.json({ message: 'Tender deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete tender' })
  }
}

exports.getAllTenders = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const offset = (page - 1) * limit

  try {
    const result = await pool.query(
      'SELECT * FROM tenders ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    )

    const total = await pool.query('SELECT COUNT(*) FROM tenders')

    res.json({
      total: parseInt(total.rows[0].count),
      page,
      limit,
      tenders: result.rows
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch tenders' })
  }
}

exports.getTendersByCompany = async (req, res) => {
  const companyId = req.params.companyId

  try {
    const result = await pool.query(
      'SELECT * FROM tenders WHERE company_id = $1 ORDER BY created_at DESC',
      [companyId]
    )

    res.json({
      tenders: result.rows
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch company tenders' })
  }
}

