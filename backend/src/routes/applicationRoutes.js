const express = require('express')
const verifyToken = require('../middlewares/verifyToken')
const {
  submitApplication,
  getApplicationsForTender,
  getMyApplications
} = require('../controllers/applicationController')

const router = express.Router()

router.get('/me', verifyToken, getMyApplications);
router.post('/', verifyToken, submitApplication)
router.get('/tender/:tenderId', getApplicationsForTender)

module.exports = router
