import express from 'express'
import * as CollectionController from '../controllers/collection.controller.js'
import { handleCheckAdmin, handleCollectionValidation } from '../utils/index.js'
import multer from 'multer'
import * as fs from 'fs'

const router = express.Router()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
          fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
      },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + '-' + file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})

router.get('/get', CollectionController.getAll)
router.get('/random/get', CollectionController.getOne)
router.post('/add', handleCheckAdmin, upload.any('images'), handleCollectionValidation, CollectionController.createOne)
router.post('/update', handleCheckAdmin, upload.any('images'), handleCollectionValidation, CollectionController.updateOne)
router.post('/delete', handleCheckAdmin, CollectionController.deleteOne)


export default router