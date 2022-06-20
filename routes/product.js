import express from 'express'
import ProductEn from '../models/product_en.model.js'
import ProductRu from '../models/product_ru.model.js'
import cryptoRandomString from 'crypto-random-string'
import multer from 'multer'
import bcrypt from 'bcrypt'
import Session from '../models/session.model.js'

const router = express.Router()

const random = id => {
    return id + cryptoRandomString({ length: 20, type: 'alphanumeric' })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimitype === 'image/jpeg' || file.mimitype === 'image/png' || file.mimitype === 'image/webp' || file.mimitype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(new Error('Not an image type'), false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})

function filtersFinder(products) {
    const filters = {}

    const colorways = []
    const sizes = []
    const prices = []
    const priceRange = {}
    const categories = []
    const brands = []
    products.forEach(element => {
        element.colorway.forEach(element => {
            colorways.push(element.name)
        })
        element.size.forEach(element => {
            if (element.availability === true) {
                sizes.push(element.name)
            }
        })
        brands.push(element.brand)
        categories.push(element.category)
        prices.push(element.price.number)

        const sorted = prices.slice().sort((a, b) => {
            return a - b
        })
        priceRange.smallest = sorted[0]
        priceRange.largest = sorted[sorted.length - 1]
    });
    const colorwaysUnique = Array.from(new Set(colorways))
    const sizesUnique = Array.from(new Set(sizes))
    const brandsUnique = Array.from(new Set(brands))
    const categoriesUnique = Array.from(new Set(categories))


    filters.colorways = colorwaysUnique
    filters.size = sizesUnique
    filters.priceRange = priceRange
    filters.brands = brandsUnique
    filters.categories = categoriesUnique

    return filters
}

router.get('/products/:type', async (req, res) => {
    const lang = req.query.lang ? req.query.lang : undefined
    const filter = {
        colorway: req.query.colorway ? { $elemMatch: { name: { $in: req.query.colorway.split('-') } } } : undefined,
        "price.number": req.query.price ? { $gte: req.query.price.split('-')[0], $lte: req.query.price.split('-')[1] } : undefined,
        size: req.query.size ? { $elemMatch: { name: { $in: req.query.size.split('-') }, availability: true } } : undefined,
        brand: req.query.brand ? { $in: req.query.brand.split('-') } : undefined,
        category: req.query.category ? req.query.category : undefined,
        gender: req.query.gender ? req.query.gendner : undefined,
        title: req.query.search ? { $regex: req.query.search } : undefined
    }
    const sortBy = req.query.sortBy ? { "price.number": req.query.sortBy } : undefined
    const type = req.params.type ? req.params.type : undefined
    const page = req.query.page ? parseInt(req.query.page) : undefined
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined

    if (lang) {
        if (lang === 'en') {
            if (type === 'all') {
                const products = await ProductEn.find(filter).sort(sortBy).skip((page - 1) * limit).limit(limit)
                const productsCategories = await ProductEn.find({})
                const totalResults = await ProductEn.find(filter).sort(sortBy).count()
                const totalPages = Math.round(totalResults / limit)
                const previousPage = (page - 1) > 0 ? page - 1 : undefined
                const nextPage = (page + 1) <= totalPages ? page + 1 : undefined
                const currentPage = page <= totalPages ? page : undefined

                res.send({
                    success: true,
                    data: products,
                    filters: filtersFinder(productsCategories),
                    message: "Products have been retrieved successfully",
                    results: {
                        totalResults: totalResults,
                        totalPages: totalPages,
                        previousPage: previousPage,
                        currentPage: currentPage,
                        nextPage: nextPage,
                        limit: limit
                    }
                })
            } else if (type === 'new_arrivals') {
                const products = await ProductEn.find(filter).sort(sortBy).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
                const productsCategories = await ProductEn.find({}).sort({ createdAt: -1 })
                const totalResults = await ProductEn.find(filter).sort(sortBy).sort({ createdAt: -1 }).count()
                const totalPages = Math.round(totalResults / limit)
                const previousPage = (page - 1) > 0 ? page - 1 : undefined
                const nextPage = (page + 1) <= totalPages ? page + 1 : undefined
                const currentPage = page <= totalPages ? page : undefined

                res.send({
                    success: true,
                    data: products,
                    filters: fileFilter(productsCategories),
                    message: "Products have been retrieved successfully",
                    results: {
                        totalResults: totalResults,
                        totalPages: totalPages,
                        previousPage: previousPage,
                        currentPage: currentPage,
                        nextPage: nextPage,
                        limit: limit
                    }
                })
            }
        } else if (lang === 'ru') {
            if (category === 'all') {
                const products = await ProductRu.find(filter).sort(sortBy).skip((page - 1) * limit).limit(limit)
                const productsCategories = await ProductRu.find({})
                const totalResults = await ProductRu.find(filter).sort(sortBy).count()
                const totalPages = Math.round(totalResults / limit)
                const previousPage = (page - 1) > 0 ? page - 1 : undefined
                const nextPage = (page + 1) <= totalPages ? page + 1 : undefined
                const currentPage = page <= totalPages ? page : undefined

                res.send({
                    success: true,
                    data: products,
                    filters: filtersFinder(productsCategories),
                    message: "Products have been retrieved successfully",
                    results: {
                        totalResults: totalResults,
                        totalPages: totalPages,
                        previousPage: previousPage,
                        currentPage: currentPage,
                        nextPage: nextPage,
                        limit: limit
                    }
                })
            } else if (category === 'new_arrivals') {
                const products = await ProductRu.find(filter).sort(sortBy).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
                const productsCategories = await ProductRu.find({}).sort({ createdAt: -1 })
                const totalResults = await ProductRu.find(filter).sort(sortBy).sort({ createdAt: -1 }).count()
                const totalPages = Math.round(totalResults / limit)
                const previousPage = (page - 1) > 0 ? page - 1 : undefined
                const nextPage = (page + 1) <= totalPages ? page + 1 : undefined
                const currentPage = page <= totalPages ? page : undefined

                res.send({
                    success: true,
                    data: products,
                    filters: filtersFinder(productsCategories),
                    message: "Products have been retrieved successfully",
                    results: {
                        totalResults: totalResults,
                        totalPages: totalPages,
                        previousPage: previousPage,
                        currentPage: currentPage,
                        nextPage: nextPage,
                        limit: limit
                    }
                })
            } else {
                res.send({
                    success: false,
                    message: 'Category is undefined'
                })
            }
        } else {
            res.send({
                success: false,
                message: 'Language is undefined'
            })
        }
    } else {
        res.send({
            success: false,
            message: 'Language is required'
        })
    }
})

router.get('/product/random', async (req, res) => {
    const lang = req.query.lang ? req.query.lang : undefined
    if (lang) {
        if (lang === 'en') {
            const products = await ProductEn.find({})
            const product = products[Math.floor(Math.random() * products.length)]
            res.send({
                success: true,
                data: product,
                message: 'Product has benn retrieved successfully'
            })
        } else if (lang === 'ru') {
            const products = await ProductRu.find({})
            const product = products[Math.floor(Math.random() * products.length)]
            res.send({
                success: true,
                data: product,
                message: 'Product has benn retrieved successfully'
            })
        } else {
            res.send({
                success: false,
                message: 'Language is undefined'
            })
        }
    } else {
        res.send({
            success: false,
            message: 'Language is required'
        })
    }
})

router.post('/add', async (req, res) => {

})

router.post('/delete', async (req, res) => {

})


export default router