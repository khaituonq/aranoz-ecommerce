const router = require('express').Router()

const stripeController = require('../controllers/stripeController')
const { isAuth } = require('../utils')

router.post('/', isAuth, stripeController)

module.exports = router