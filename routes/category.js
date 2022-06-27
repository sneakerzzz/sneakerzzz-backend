import express from 'express'
import * as CategoryController from '../controllers/category.controller.js'
import { handleCheckAdmin, handleCategoryValidation } from '../utils/index.js'

const router = express.Router()

router.get('/get', CategoryController.getAll)
router.post('/add', handleCheckAdmin, handleCategoryValidation, CategoryController.createOne)
router.post('/update', handleCheckAdmin, handleCategoryValidation, CategoryController.updateOne)
router.post('/delete', handleCheckAdmin, CategoryController.deleteOne)


export default router