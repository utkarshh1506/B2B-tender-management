const express = require('express')
const verifyToken = require('../middlewares/verifyToken')
const { createCompany, getMyCompany, updateCompany, deleteCompany } = require('../controllers/companyController')

const router = express.Router()

// POST /api/companies
router.post('/', verifyToken, createCompany)
router.get('/me',verifyToken,getMyCompany)
router.put('/:id',verifyToken, updateCompany)
router.delete('/:id',verifyToken,deleteCompany)

module.exports = router
