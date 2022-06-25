import { createUserValidation } from "../validations.js"

export default (req, res, next) => {
    const errors = createUserValidation(req)
    if (errors.length === 0){
        next()
    } else {
        res.send({
            success: false,
            message: errors
        })
    }
}