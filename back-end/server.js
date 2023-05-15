require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const productRoute = require('./routes/productRoute')
const userRoute = require('./routes/userRoute')
const imageRoute = require('./routes/imageRoute')
const orderRoute = require('./routes/orderRoute')
const stripeRoute = require('./routes/stripeRoute')

mongoose.connect(process.env.MONGODB_URI_LOCAL)
.then(() => {
  console.log('Connected to MongoDB')
})
.catch(err => console.log(err)) 

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})
app.use('/api/product', productRoute)
app.use('/api/user', userRoute)
app.use('/api', imageRoute)
app.use('/api/order', orderRoute)
app.use('/api/stripe', stripeRoute)

const port = process.env.PORT || 5000 
app.listen(port, () => console.log(`Server at http://localhost:${port}`)) 

