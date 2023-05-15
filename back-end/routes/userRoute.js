const router = require('express').Router();

const userController = require('../controllers/userController')
const utils = require('../utils')


router.get('/', utils.isAuth, utils.isAdmin, userController.getUserList)

router.put('/profile', utils.isAuth, userController.updateProfile)

router.post('/signup', userController.signUp)
router.post('/login', userController.logIn)
router.patch('/update-admin/:id', utils.isAuth, utils.isAdmin, userController.updateAdmin)

router.route('/:id')
.get(utils.isAuth, utils.isAdmin, userController.getUser)
.put(utils.isAuth, utils.isAdmin, userController.updateUser)
.delete(utils.isAuth, utils.isAdmin, userController.deleteUser)


module.exports = router