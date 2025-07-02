const express = require('express')
const verifyToken = require('../middlewares/verifyToken')
const { createCompany, getMyCompany, updateCompany, deleteCompany, searchCompanies } = require('../controllers/companyController')
const multer = require('multer')
const path = require('path')
const { uploadCompanyLogo } = require('../controllers/companyLogoController')

const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router()

// POST /api/companies
router.post('/', verifyToken, createCompany)
router.get('/me',verifyToken,getMyCompany)
router.put('/:id',verifyToken, updateCompany)
router.delete('/:id',verifyToken,deleteCompany)
router.post('/upload-logo', verifyToken, upload.single('logo'), uploadCompanyLogo)
router.get('/search', searchCompanies)

module.exports = router
