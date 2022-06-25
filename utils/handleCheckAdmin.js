import User from "../models/user.model.js"
import Session from "../models/session.model.js"

export default async (req, res, next) => {
    const { sessionID } = req.body
    const session = await Session.findOne({ sessionID: sessionID })
    if (session) {
        const user = await User.findOne({ _id: session?.userID, role: 'admin' })
        if (user) {
            next()
        } else {
            res.send({
                success: false,
                message: 'User is not an admin'
            })
        }
    } else {
        res.send({
            success: false,
            message: 'Session not found'
        })
    }
}