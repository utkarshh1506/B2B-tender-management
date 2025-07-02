const express = require('express')
const verifyToken = require('../middlewares/verifyToken')
const {
  submitApplication,
  getApplicationsForTender
} = require('../controllers/applicationController')

const router = express.Router()

router.post('/', verifyToken, submitApplication)
router.get('/tender/:tenderId', getApplicationsForTender)

module.exports = router
