const express = require('express')
const verifyToken = require('../middlewares/verifyToken')
const { createTender, getMyTenders, updateTender, deleteTender, getAllTenders, getTendersByCompany, getTenderById } = require('../controllers/tenderController')
const router = express.Router()

router.post('/', verifyToken, createTender)
router.get('/', verifyToken, getMyTenders)
router.put('/:id', verifyToken, updateTender)
router.delete('/:id', verifyToken, deleteTender)
router.get('/all', getAllTenders) 
router.get('/company/:companyId', getTendersByCompany)
router.get('/:id', verifyToken, getTenderById)

module.exports = router
