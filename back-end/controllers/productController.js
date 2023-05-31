const asyncHandler = require('express-async-handler')

const Product = require('../models/productModel')


module.exports = {
  getProductList: asyncHandler(async (req, res) => {
    const products = await Product.find().limit(9)
    res.send(products)
  }),

  getBannerList: asyncHandler(async (req, res) => {
    const products = await Product.find({bannerUsage: true}).sort({"createdAt": -1})
    res.send(products)
  }),

  getProductById: asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
      res.send(product)
    } else {
      res.status(404).send({message: "Product Not Found"})
    }
  }),

  postProduct: asyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: "sample name " + Date.now(),
      slug: "sample-name-" + Date.now(),
      useOrNot: true,
      bannerUsage: false, 
      image: {
        asset_id: "cf5864f8a334c558564d7e0845f9aa07",
        public_id: "aranoz/wsxvjc6fi2c1qkx4urhj",
        secure_url: "https://res.cloudinary.com/dwnyhsybl/image/upload/v1681887357/aranoz/wsxvjc6fi2c1qkx4urhj.png"
      },  
      price: 0,
      category: "sample category",
      brand: "sample brand",
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: "sample description",
    })
    const product = await newProduct.save()
    res.send({message: "Product created", product})
  }),

  updateProduct: asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
      product.name = req.body.name,
      product.slug = req.body.slug,
      product.useOrNot = req.body.useOrNot || true
      product.bannerUsage = req.body.bannerUsage || false
      product.price = req.body.price,
      product.image = req.body.image,
      product.images = req.body.images,
      product.category = req.body.category,
      product.brand = req.body.brand,
      product.countInStock = req.body.countInStock,
      product.description = req.body.description
      await product.save()
      res.send({message: "Product Updated"})
    } else {
      res.status(404).json({message: "Product Not Found"})
    }
  }),

  deleteProduct: asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
      await product.deleteOne()
      res.send({message: "Product Deleted"})
    } else {
      res.status(404).send({message: "Product Not Found"})
    }
  }),

  postReview: asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
      if (product.reviews.find(x => x.name === req.user.name)) {
        return res.status(400).send({message: "You already submitted a review"})
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment
      }

      product.reviews.push((review))
      product.numReviews = product.reviews.length
      product.rating = product.reviews.reduce((a, c) => c.rating + a,0) / product.reviews.length
      const updatedProduct = await product.save()
      res.status(201).send({
        message: "Review Created",
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating
      })
    } else {
      res.status(404).send({message: "Product Not Found"})
    }
  }),

  getCategories: asyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category")
    res.send(categories)
  }),

  getProductBySlug: asyncHandler(async (req, res) => {
    const product = await Product.findOne({slug: req.params.slug})
    if (product) {
      res.send(product)
    } else {
      res.status(404).send({message: "Product Not Found"})
    }
  }),

  getProductByAdmin: asyncHandler(async (req, res) => {
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 3
    const product = await Product.find().skip(pageSize * (page - 1)).limit(pageSize).sort({"createdAt": -1})
    const countProducts = await Product.countDocuments()
    res.send({product, countProducts, page, pages : Math.ceil(countProducts / pageSize)})
  }),

  searchProduct: asyncHandler(async (req, res) => {
    const pageSize = req.query.pageSize || 3
    const page = req.query.page || 1
    const category = req.query.category || ""
    const price = req.query.price || ""
    const rating = req.query.rating || ""
    const order = req.query.order || ""
    const searchQuery = req.query.query || ""
    const queryFilter = searchQuery && searchQuery !== "all" ? {name: {$regex: searchQuery, options: "i"}} : {}
    const categoryFilter = category && category !== "all" ? {category} : {}
    const ratingFilter = rating && rating !== "all" ? {rating: {$gte: Number(rating)}} : {}
    const priceFilter = price && price !== "all" ? {price: {$gte: Number(price.split("-")[0]), $lte: Number(price.split("-")[1])}} : {}
    const sortOrder = order === "featured" ? {featured: -1} : order === "lowest" ? {price: 1} : order === "highest" ? {price: -1} : order === "toprated" ? {rating: -1} : order === "newest" ? {createAt: -1} : {_id: -1}
    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter
    }).sort(sortOrder).skip(pageSize * (page - 1)).limit(pageSize)
    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter
    })

    res.send({products, countProducts, page, pages: Math.ceil(countProducts / pageSize)})
  }),

  updateStatus: asyncHandler(async (req, res) => {
    await Product.findByIdAndUpdate(req.params.id, {useOrNot: req.body.status}, {new: true})

    res.send({message: "Update Status successfully"})
  })
}
