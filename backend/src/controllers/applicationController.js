const pool = require('../config/db')

exports.submitApplication = async (req, res) => {
  const userId = req.user.userId
  const { tender_id, proposal, proposed_budget } = req.body

  try {
    const companyRes = await pool.query(
      'SELECT id FROM companies WHERE user_id = $1',
      [userId]
    )

    if (companyRes.rows.length === 0) {
      return res.status(403).json({ error: 'Company not found for user' })
    }

    const companyId = companyRes.rows[0].id

    // Prevent duplicate application
    const existing = await pool.query(
      'SELECT * FROM applications WHERE company_id = $1 AND tender_id = $2',
      [companyId, tender_id]
    )

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Already applied to this tender' })
    }

    const result = await pool.query(
      `INSERT INTO applications (company_id, tender_id, proposal, proposed_budget)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [companyId, tender_id, proposal, proposed_budget]
    )

    res.status(201).json({ application: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to submit application' })
  }
}

exports.getApplicationsForTender = async (req, res) => {
  const tenderId = req.params.tender_id

  try {
    const result = await pool.query(
      `SELECT a.*, c.name AS company_name
       FROM applications a
       JOIN companies c ON a.company_id = c.id
       WHERE a.tender_id = $1`,
      [tenderId]
    )

    res.json({ applications: result.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch applications' })
  }
}
