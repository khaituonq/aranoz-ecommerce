const router = require('express').Router()

const orderController = require('../controllers/orderController')
const { isAuth, isAdmin } = require('../utils')


router.get('/mine', isAuth, orderController.getMyOrder)
router.get('/summary', isAuth, isAdmin, orderController.getDetailSummary)

router.put('/:id/deliver', isAuth, orderController.updateDeliver)
router.put('/:id/pay', isAuth, orderController.updatePay)

router.route('/')
.get(isAuth, isAdmin, orderController.orderList)
.post(isAuth, orderController.writeOrder)

router.route('/:id')
.get(isAuth, orderController.getOrderById)
.delete(isAuth, isAdmin, orderController.deleteOrder)

module.exports = router