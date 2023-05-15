const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel')
const utils = require('../utils')

module.exports = {
  getUserList: asyncHandler(async (req, res) => {
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 6
    const users = await User.find().skip(pageSize * (page - 1)).limit(pageSize).sort({'createdAt': -1})
    const countUsers = await User.countDocuments()
    res.send({users, countUsers, page, pages : Math.ceil(countUsers / pageSize)})
  }),

  getUser: asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
      res.send(user)
    } else {
      res.status(404).send({message: "User Not Found"})
    }
  }),

  updateUser: asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = req.body.isAdmin
      const updateUser = await user.save()
      res.send({message: "User Updated", user: updateUser})
    } else {
      res.status(404).send({message: "User Not Found"})
    }
  }),

  deleteUser: asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
      if (user.email === "khaituong2909@gmail.com") {
        req.status(400).send({message: "Can Not Delete Admin User"})
        return
      }
      await user.deleteOne()
      res.send({message: "User Deleted"})
    } else {
      res.status(404).send({message: "User Not Found"})
    }
  }),

  logIn: asyncHandler( async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: utils.generateToken(user)
        })
        return
      }
    }
    res.status(401).send({message: "Invalid email or password"})
  }),

  signUp: asyncHandler( async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    })
    const user = await newUser.save()
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: utils.generateToken(user)
    })
  }),

  updateProfile: asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8)
      }

      const updateUser = await user.save()
      res.send({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        isAdmin: updateUser.isAdmin,
        token: utils.generateToken(user)
      })
    } else {
      res.status(401).send({message: "User Not Found"})
    }
  }), 

  updateAdmin: asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(req.params.id, {isAdmin: req.body.status}, {new: true})

    res.send({message: "Update Admin successfully"})
  })
}
