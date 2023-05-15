const router = require('express').Router()

const productController = require('../controllers/productController')
const { isAuth, isAdmin } = require("../utils")

router.get("/admin", productController.getProductByAdmin)
router.get("/search", productController.searchProduct)
router.get("/categories", productController.getCategories)
router.get("/slug/:slug", productController.getProductBySlug)
router.get('/banners', productController.getBannerList)

router.post("/:id/reviews", isAuth, productController.postReview)
router.patch('/update-status/:id', isAuth, isAdmin, productController.updateStatus)

router.route('/')
.get(productController.getProductList)
.post(isAuth, isAdmin, productController.postProduct)

router.route('/:id')
.get(productController.getProductById)
.put(isAuth, isAdmin, productController.updateProduct)
.delete(isAuth, isAdmin, productController.deleteProduct)

module.exports = router