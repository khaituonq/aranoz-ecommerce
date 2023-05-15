const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const asyncHandler = require('express-async-handler')
const { configCloudinary } = require('../utils')

module.exports = {
  uploadSingle: asyncHandler(async(req, res) => {
    configCloudinary()

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({folder: "aranoz"},(err, result) => {
          if (result) {
            resolve(result)
          } else {
            reject(err)
          }
        })
        streamifier.createReadStream(req.file.buffer).pipe(stream)
      })
    }
    
    const result = await streamUpload(req)
    res.send(result)
  }),

  deleteSingle: asyncHandler(async(req, res) => {
    configCloudinary()

    const {result} = await cloudinary.uploader.destroy(req.body.image)
    if (result === "ok"){
      res.send({message: "Deleted successfully"})
    } else {
      res.send({message: "Deleted failed"})
    }
  })
}