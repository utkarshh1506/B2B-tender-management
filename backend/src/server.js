const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')
const companyRoutes = require('./routes/companyRoutes')
const companyLogoRoutes = require('./routes/companyRoutes')
const tenderRoutes = require('./routes/tenderRoutes')

dotenv.config()


const app = express();
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/companies',companyRoutes)
app.use('/api/companies', companyLogoRoutes)
app.use('/api/tender',tenderRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT} `)
})
