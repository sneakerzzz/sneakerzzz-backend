import CategoryEn from "../models/category_en.model.js"
import CategoryRu from "../models/category_ru.model.js"

export const getAll = async (req, res) => {
    try {
        const lang = req.query.lang
        if (lang === 'en') {
            const categories = await CategoryEn.find({})
            res.send({
                success: true,
                data: categories,
                message: "Categories have been retrieved successfully",
            })
        } else if (lang === 'ru') {
            const categories = await CategoryRu.find({})
            res.send({
                success: true,
                data: categories,
                message: "Категории были успешно доставлены",
            })
        }
    } catch (err) {
        res.send({
            success: false,
            message: 'Error'
        })
    }
}

export const createOne = async (req, res) => {
    try {
        const lang = req.query.lang
        if (lang === 'en') {
            const { name, code, subCategories } = req.body

            new CategoryEn({
                name: name,
                code: code,
                subCategories: subCategories
            }).save(err => {
                if (!err) {
                    res.send({
                        success: true,
                        message: 'Category has been added successfully'
                    })
                } else {
                    res.send({
                        success: false,
                        message: 'Error'
                    })
                }
            })
        } else if (lang === 'ru') {
            const { name, code, subCategories } = req.body

            new CategoryRu({
                name: name,
                code: code,
                subCategories: subCategories
            }).save(err => {
                if (!err) {
                    res.send({
                        success: true,
                        message: 'Категория была успешно добавлена'
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

export const updateOne = async (req, res) => {
    try {
        const lang = req.query.lang
        if (lang === 'en') {
            const { _id, name, code, subCategories } = req.body

            CategoryEn.findOneAndUpdate({ _id: _id }, {
                name: name,
                code: code,
                subCategories: subCategories
            },
                (err) => {
                    if (!err) {
                        res.send({
                            success: true,
                            message: 'Category has been updated successfully'
                        })
                    } else {
                        res.send({
                            success: false,
                            message: 'Error'
                        })
                    }
                })
        } else if (lang === 'ru') {
            const { _id, name, code, subCategories } = req.body

            CategoryRu.findOneAndUpdate({ _id: _id }, {
                name: name,
                code: code,
                subCategories: subCategories
            },
                (err) => {
                    if (!err) {
                        res.send({
                            success: true,
                            message: 'Категория была успешно изменена'
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
            message: "Error"
        })
    }
}

export const deleteOne = async (req, res) => {
    try {
        const lang = req.query.lang
        if (lang === 'en') {
            const { _id } = req.body

            CategoryEn.findOneAndDelete({ _id: _id },
                (err) => {
                    if (!err) {
                        res.send({
                            success: true,
                            message: 'Category has been deleted successfully'
                        })
                    } else {
                        res.send({
                            success: false,
                            message: 'Error'
                        })
                    }
                })
        } else if (lang === 'ru') {
            const { _id } = req.body

            CategoryRu.findOneAndDelete({ _id: _id },
                (err) => {
                    if (!err) {
                        res.send({
                            success: true,
                            message: 'Категория была успешно удалена'
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
            message: "Error"
        })
    }
}