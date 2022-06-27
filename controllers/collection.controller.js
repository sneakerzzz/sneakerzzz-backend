import CollectionEn from "../models/collection_en.model.js"
import CollectionRu from "../models/collection_ru.model.js"

export const getAll = async (req, res) => {
    try {
        const lang = req.query.lang ? req.query.lang : undefined
        if (lang) {
            if (lang === 'en') {
                const collections = await CollectionEn.find({})
                res.send({
                    success: true,
                    data: collections,
                    message: "Collections have been retrieved successfully",
                })
            } else if (lang === 'ru') {
                const collections = await CollectionRu.find({})
                res.send({
                    success: true,
                    data: collections,
                    message: "Collections have been retrieved successfully",
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

export const getOne = async (req, res) => {
    try {
        const lang = req.query.lang ? req.query.lang : undefined
        if (lang) {
            if (lang === 'en') {
                const collections = await CollectionEn.find({})
                const collection = collections[Math.floor(Math.random() * collections.length)]
                res.send({
                    success: true,
                    data: collection,
                    message: "Collection have been retrieved successfully",
                })
            } else if (lang === 'ru') {
                const collections = await CollectionRu.find({})
                const collection = collections[Math.floor(Math.random() * collections.length)]
                res.send({
                    success: true,
                    data: collection,
                    message: "Collection have been retrieved successfully",
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

export const createOne = async (req, res) => {
    try {
        const lang = req.query.lang ? req.query.lang : undefined
        if (lang) {
            if (lang === 'en') {
                const { name, description, code } = req.body
                const imagesArray = []
                req.files.images.forEach(file => {
                    imagesArray.push(file.path)
                })

                new CollectionEn({
                    name: name,
                    code: code,
                    description: description,
                    images: imagesArray
                }).save(err => {
                    if (!err) {
                        res.send({
                            success: true,
                            message: 'Collection has been added successfully'
                        })
                    } else {
                        res.send({
                            success: false,
                            message: 'Error'
                        })
                    }
                })
            } else if (lang === 'ru') {
                const { name, description, code } = req.body
                const imagesArray = []
                req.files.images.forEach(file => {
                    imagesArray.push(file.path)
                })

                new CollectionRu({
                    name: name,
                    code: code,
                    description: description,
                    images: imagesArray
                }).save(err => {
                    if (!err) {
                        res.send({
                            success: true,
                            message: 'Collection has been added successfully'
                        })
                    } else {
                        res.send({
                            success: false,
                            message: 'Error'
                        })
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

export const updateOne = async (req, res) => {
    try {
        const lang = req.query.lang ? req.query.lang : undefined
        if (lang) {
            if (lang === 'en') {
                const { _id, name, code, description } = req.body

                CollectionEn.findOneAndUpdate({ _id: _id }, {
                    name: name,
                    code: code,
                    description: description
                },
                    (err) => {
                        if (!err) {
                            res.send({
                                success: true,
                                message: 'Collection has been updated successfully'
                            })
                        } else {
                            res.send({
                                success: false,
                                message: 'Error'
                            })
                        }
                    })
            } else if (lang === 'ru') {
                const { _id, name, code, description } = req.body

                CollectionRu.findOneAndUpdate({ _id: _id }, {
                    name: name,
                    code: code,
                    description: description
                },
                    (err) => {
                        if (!err) {
                            res.send({
                                success: true,
                                message: 'Collection has been updated successfully'
                            })
                        } else {
                            res.send({
                                success: false,
                                message: 'Error'
                            })
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
            message: "Error"
        })
    }
}

export const deleteOne = async (req, res) => {
    try {
        const lang = req.query.lang ? req.query.lang : undefined
        if (lang) {
            if (lang === 'en') {
                const { _id } = req.body

                CollectionEn.findOneAndDelete({ _id: _id },
                    (err) => {
                        if (!err) {
                            res.send({
                                success: true,
                                message: 'Collection has been deleted successfully'
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

                CollectionRu.findOneAndDelete({ _id: _id },
                    (err) => {
                        if (!err) {
                            res.send({
                                success: true,
                                message: 'Collection has been deleted successfully'
                            })
                        } else {
                            res.send({
                                success: false,
                                message: 'Error'
                            })
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
            message: "Error"
        })
    }
}