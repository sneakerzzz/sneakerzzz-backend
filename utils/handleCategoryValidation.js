import { createCategoryValidation } from "../validations.js"

export default (req, res, next) => {
    const errors = createCategoryValidation(req)
    if (errors.length === 0){
        next()
    } else {
        res.send({
            success: false,
            message: errors
        })
    }
}