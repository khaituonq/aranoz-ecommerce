const router = require('express').Router();
const multer = require('multer');

const { isAdmin, isAuth } = require('../utils')
const imageController = require('../controllers/imageController')

const upload = multer()

router.post("/upload", isAuth, isAdmin, upload.single("file"), imageController.uploadSingle)
router.delete("/delete", isAuth, isAdmin, imageController.deleteSingle)

module.exports = router
