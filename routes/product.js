import express from 'express'
import * as ProductController from '../controllers/product.controller.js'
// import multer from 'multer'
// import * as fs from 'fs'

const router = express.Router()

// const storage = multer.diskStorage({
//     destination: (_, __, cb) => {
//         if (!fs.existsSync('uploads')) {
//           fs.mkdirSync('uploads');
//         }
//         cb(null, 'uploads');
//       },
//     filename: function (req, file, cb) {
//         cb(null, new Date().toISOString().replace(/:/g, "-") + '-' + file.originalname)
//     }
// })

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 10
//     }
// })

router.get('/products/:sort/', ProductController.getAll)


export default router