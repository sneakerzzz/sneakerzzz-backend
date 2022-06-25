import { changePasswordValidation } from "../validations.js"

export default (req, res, next) => {
    const errors = changePasswordValidation(req)
    if (errors.length === 0){
        next()
    } else {
        res.send({
            success: false,
            message: errors
        })
    }
}