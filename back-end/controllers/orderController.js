const asyncHandler = require('express-async-handler')

const Order = require('../models/orderModel')
const User = require('../models/userModel')
const Product = require('../models/userModel')
const { mailgun, payOrderEmailTemplate } = require('../utils')


module.exports = {
  orderList: asyncHandler(async(req, res) => {
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 10
    const orders = await Order.find().populate("user", "name").skip(pageSize * (page - 1)).limit(pageSize).sort({"createdAt": -1})
    const countOrders = await Order.countDocuments()
    res.send({orders, countOrders, page, pages : Math.ceil(countOrders / pageSize)})
  }),

  writeOrder: asyncHandler(async(req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map(x => ({...x, product: x._id})),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id
    })

    const order = await newOrder.save()
    res.status(201).send({message: "New Order Created", order})
  }),

  getDetailSummary: asyncHandler(async(req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 } ,
          totalSales: {$sum: "$totalPrice"}
        }
      }
    ])

    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 }
        }
      }
    ])

    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt"}},
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice"}
        }
      },
      { $sort: { _id: 1 }}
    ])

    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.send({users, orders, dailyOrders, productCategories})
  }),

  getMyOrder: asyncHandler(async (req, res) => {
    const order = await Order.find({user: req.user._id})
    res.send(order)
  }),

  getOrderById: asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      res.send(order)
    } else {
      res.status(404).send({message: 'Order not found'})
    }
  }),

  updateDeliver: asyncHandler(async  (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      order.isDelivered = true
      order.deliveredAt = Date.now()
      await order.save()
      res.send({message: 'Order Delivered'})
    } else {
      res.status(404).send({message: "Order Not Found"})
    }
  }),

  updatePay: asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "email name")
    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address
      }

      const updateOrder = await order.save()
      const emailData = {
        from: `Aranoz store <aranoz@gmail.com`,
        // to: `${order.user.name} <${order.user.email}>`,
        to: "khaituong2909@gmail.com",
        subject: `New order ${order._id}`,
        html: payOrderEmailTemplate(order)
      }

      mailgun()
        .messages()
        .send(emailData, (error, body) => {
          if (error) {
            console.log(error)
          } else {
            console.log(body)
          }
        })
      res.send({message: "Order Paid", order: updateOrder})
    } else {
      res.status(404).send({message: "Order Not Found"})
    }
  }),

  deleteOrder: asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      await order.deleteOne()
      res.send({message: "Order Deleted"})
    } else {
      res.status(404).send({message: "Order Not Found"})
    }
  })

}