const supabase = require('../utils/supabas')
const pool = require('../config/db')
const path = require('path')

exports.uploadCompanyLogo = async (req, res) => {
  const userId = req.user.userId
  const file = req.file

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  try {
    const fileName = `logo-${userId}-${Date.now()}${path.extname(file.originalname)}`

    const { data, error } = await supabase.storage
      .from('company-logos')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      })

    if (error) {
      console.error(error)
      return res.status(500).json({ error: 'Upload failed' })
    }

    const { data: publicUrlData } = supabase.storage
      .from('company-logos')
      .getPublicUrl(fileName)

    await pool.query(
      'UPDATE companies SET logo_url = $1 WHERE user_id = $2',
      [publicUrlData.publicUrl, userId]
    )

    res.json({
      message: 'Logo uploaded successfully',
      logo_url: publicUrlData.publicUrl
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
