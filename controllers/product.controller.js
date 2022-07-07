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
        const lang = req.query.lang
        const filterOne = {
            colorway: req.query.colorway ? { $elemMatch: { name: { $in: req.query.colorway.split('-') } } } : undefined,
            "price.value": req.query.price ? { $gte: parseInt(req.query.price.split('-')[0]), $lte: parseInt(req.query.price.split('-')[1]) } : undefined,
            size: req.query.size ? { $elemMatch: { value: { $in: req.query.size.split('-') }, availability: true } } : undefined,
            brand: req.query.brand ? { $in: req.query.brand.split('-') } : undefined,
        }
        const filterTwo = {
            gender: req.query.category ? req.query.category.split('_')[0].charAt(0).toUpperCase() + req.query.category.split('_')[0].slice(1) : undefined,
            "collections.code": req.query.collection ? req.query.collection : undefined,
            "category.code": req.query.category ? req.query.category.split('_')[1] !== 'all' ? req.query.category.split('_')[1] : undefined : undefined,
            name: req.query.search ? { $regex: req.query.search } : undefined,
        }
        const sortBy = req.query.sortBy ? { "price.value": req.query.sortBy } : undefined
        const page = req.query.page ? parseInt(req.query.page) : undefined
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined
        const sort = req.params.sort ? req.params.sort !== 'all' ? req.params.sort === 'new_arrivals' ? { createdAt: 1 } : req.params.sort === 'trendings' ? { views: 1 } : undefined : undefined : undefined

        if (lang === 'en') {
            const products = await ProductEn.find(filterOne).find(filterTwo).sort(sortBy).sort(sort).skip((page - 1) * limit).limit(limit)
            const productsCategories = await ProductEn.find(filterTwo).sort(sortBy).sort(sort)
            const totalResults = await ProductEn.find(filterOne).find(filterTwo).sort(sortBy).sort(sort).count()
            const totalPages = Math.ceil(totalResults / limit)
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
            const products = await ProductRu.find(filterOne).find(filterTwo).sort(sortBy).sort(sort).skip((page - 1) * limit).limit(limit)
            const productsCategories = await ProductRu.find(filterTwo).sort(sortBy).sort(sort)
            const totalResults = await ProductRu.find(filterOne).find(filterTwo).sort(sortBy).sort(sort).count()
            const totalPages = Math.ceil(totalResults / limit)
            const previousPage = (page - 1) > 0 ? page - 1 : undefined
            const nextPage = (page + 1) <= totalPages ? page + 1 : undefined
            const currentPage = page <= totalPages ? page : undefined

            res.send({
                success: true,
                data: products,
                facets: filtersFinder(productsCategories),
                message: "Продукты были успешно доставлены",
                pagination: {
                    totalResults: totalResults,
                    totalPages: totalPages,
                    previousPage: previousPage,
                    currentPage: currentPage,
                    nextPage: nextPage,
                    limit: limit
                }
            })
        }
    } catch (err) {
        res.send({
            success: false,
            message: 'Error'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const lang = req.query.lang
        if (lang === 'en') {
            const _id = req.params.id

            ProductEn.findOneAndUpdate({ _id: _id }, {
                $inc: { views: 1 }
            },
                {
                    returnDocument: 'after'
                },
                (err, doc) => {
                    if (!err) {
                        res.send({
                            success: true,
                            message: 'Product has been retrieved successfully',
                            data: doc
                        })
                    } else {
                        res.send({
                            success: false,
                            message: 'Error'
                        })
                    }
                })
        } else if (lang === 'ru') {
            const _id = req.params.id

            ProductRu.findOneAndUpdate({ _id: _id }, {
                $inc: { views: 1 }
            },
                {
                    returnDocument: 'after'
                },
                (err, doc) => {
                    if (!err) {
                        res.send({
                            success: true,
                            message: 'Продукт был успешно доставлен',
                            data: doc
                        })
                    } else {
                        res.send({
                            success: false,
                            message: 'Ошибка'
                        })
                    }
                })
        }
    } catch (err) {
        res.send({
            success: false,
            message: 'Error'
        })
    }
}