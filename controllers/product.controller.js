import ProductEn from '../models/product_en.model.js'
import ProductRu from '../models/product_ru.model.js'

function filtersFinder(products) {
    const filters = {}

    const colorways = []
    const sizes = []
    const prices = []
    const priceRange = {}
    const brands = []
    products.forEach(element => {
        element.colorway.forEach(element => {
            colorways.push(element.name)
        })
        element.size.forEach(element => {
            if (element.availability === true) {
                sizes.push(element.value)
            }
        })
        brands.push(element.brand)
        prices.push(element.price.value)

        const sorted = prices.slice().sort((a, b) => {
            return a - b
        })
        priceRange.smallest = sorted[0]
        priceRange.largest = sorted[sorted.length - 1]
    });
    const colorwaysUnique = Array.from(new Set(colorways))
    const sizesUnique = Array.from(new Set(sizes)).sort((a, b) => a - b)
    const brandsUnique = Array.from(new Set(brands))


    filters.colorways = colorwaysUnique
    filters.size = sizesUnique
    filters.priceRange = priceRange
    filters.brands = brandsUnique

    return filters
}

export const getAll = async (req, res) => {
    try {
        const lang = req.query.lang ? req.query.lang : undefined
        const filter = {
            colorway: req.query.colorway ? { $elemMatch: { name: { $in: req.query.colorway.split('-') } } } : undefined,
            "price.value": req.query.price ? { $gte: parseInt(req.query.price.split('-')[0]), $lte: parseInt(req.query.price.split('-')[1]) } : undefined,
            size: req.query.size ? { $elemMatch: { value: { $in: req.query.size.split('-') }, availability: true } } : undefined,
            brand: req.query.brand ? { $in: req.query.brand.split('-') } : undefined,
            name: req.query.search ? { $regex: req.query.search } : undefined,
            "category.code": req.query.category ? req.query.category.split('_')[1] !== 'all' ? req.query.category.split('_')[1] : undefined : undefined,
            "collections.code": req.query.collection ? req.query.collection : undefined,
            gender: req.query.category ? req.query.category.split('_')[0].charAt(0).toUpperCase() + req.query.category.split('_')[0].slice(1) : undefined
        }
        const priceSortBy = req.query.priceSortBy ? { "price.value": req.query.priceSortBy } : undefined
        const dateSortBy = req.query.dateSortBy ? { createdAt: req.query.dateSortBy } : undefined
        const sortBy = priceSortBy || dateSortBy
        const page = req.query.page ? parseInt(req.query.page) : undefined
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined

        if (lang) {
            if (lang === 'en') {
                const products = await ProductEn.find(filter).sort(sortBy).skip((page - 1) * limit).limit(limit)
                const productsCategories = await ProductEn.find({})
                const totalResults = await ProductEn.find(filter).sort(sortBy).count()
                const totalPages = (totalResults + limit - 1)/limit
                const previousPage = (page - 1) > 0 ? page - 1 : undefined
                const nextPage = (page + 1) <= totalPages ? page + 1 : undefined
                const currentPage = page <= totalPages ? page : undefined

                res.send({
                    success: true,
                    data: products,
                    facets: filtersFinder(productsCategories),
                    message: "Products have been retrieved successfully",
                    pagination: {
                        totalResults: totalResults,
                        totalPages: totalPages,
                        previousPage: previousPage,
                        currentPage: currentPage,
                        nextPage: nextPage,
                        limit: limit
                    }
                })
            } else if (lang === 'ru') {
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
                    facets: filtersFinder(productsCategories),
                    message: "Products have been retrieved successfully",
                    pagination: {
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
                    message: 'Language is undefined'
                })
            }
        } else {
            res.send({
                success: false,
                message: 'Language is required'
            })
        }
    } catch (err) {
        res.send({
            success: false,
            message: 'Error'
        })
    }
}