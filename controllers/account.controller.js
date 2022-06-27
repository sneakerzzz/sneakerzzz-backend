import User from '../models/user.model.js'
import cryptoRandomString from 'crypto-random-string'
import bcrypt from 'bcrypt'
import Session from '../models/session.model.js'

const random = id => {
    return id + cryptoRandomString({ length: 20, type: 'alphanumeric' })
}

export const register = async (req, res) => {
    try {
        const { username, password, lang, email } = req.body
        const _email = await User.findOne({ email: email })
        if (_email) {
            res.send({
                success: false,
                message: 'Email already exists'
            })
        } else {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            const doc = new User({
                username: username,
                password: hash,
                role: 'user',
                img: 'uploads/default-avatar.png',
                lang: lang,
                email: email
            })

            const user = await doc.save()

            const _sessionID = random(user._id)
            new Session({
                sessionID: _sessionID,
                userID: user._id,
            }).save()

            res.send({
                success: true,
                message: 'Successful registration',
                sessionID: _sessionID
            })
        }
    } catch (err) {
        res.send({
            success: false,
            message: 'Error'
        })
    }
}

export const login = async (req, res) => {
    try {
        const { password, email } = req.body
        const user = await User.findOne({ email: email })
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                const sessionID = random(user._id)
                new Session({
                    sessionID: sessionID,
                    userID: user._id,
                    createdAt: new Date()
                }).save()

                res.send({
                    success: true,
                    message: 'Successful login',
                    sessionID: sessionID
                })
            } else {
                res.send({
                    success: false,
                    message: 'Incorrect password'
                })
            }
        } else {
            res.send({
                success: false,
                message: 'User not found'
            })
        }
    } catch (err) {
        res.send({
            success: false,
            message: 'Error'
        })
    }
}

export const loginSession = async (req, res) => {
    try {
        const { sessionID } = req.body
        if (sessionID) {
            const session = await Session.findOne({ sessionID: sessionID })
            if (session) {
                const user = await User.findOne({ _id: session.userID })
                res.send({
                    success: true,
                    message: "Account has been retrieved successfully",
                    data: user
                })
            } else {
                res.send({
                    success: false,
                    message: 'Session not found'
                })
            }
        } else {
            res.send({
                success: false,
                message: 'Missing fields'
            })
        }
    } catch (err) {
        res.send({
            success: false,
            message: 'Error'
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { sessionID, password } = req.body
        if (sessionID && password) {
            const session = await Session.findOne({ sessionID: sessionID })
            if (session) {
                const user = await User.findOne({ _id: session.userID })
                if (await bcrypt.compare(password, user.password)) {
                    User.findOneAndDelete({ _id: session.userID }, (err) => {
                        if (!err) {
                            Session.deleteMany({ userID: session.userID }, (err) => {
                                if (!err) {
                                    res.send({
                                        success: true,
                                        message: 'User was deleted succesfully'
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
                                message: 'Error'
                            })
                        }
                    })
                } else {
                    res.send({
                        success: false,
                        message: 'Incorrect password'
                    })
                }
            } else {
                res.send({
                    success: false,
                    message: 'Session not found'
                })
            }
        } else {
            res.send({
                success: false,
                message: 'Missing fields'
            })
        }
    } catch (err) {
        res.send({
            success: false,
            message: 'Error'
        })
    }
}

export const deleteSession = async (req, res) => {
    try {
        const { sessionID } = req.body
        if (sessionID) {
            Session.findOneAndDelete({ sessionID: sessionID }, (err) => {
                if (!err) {
                    res.send({
                        success: true,
                        message: 'Session was deleted successfully'
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
                message: 'Missing fields'
            })
        }
    } catch (err) {
        res.send({
            success: false,
            message: 'Error'
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { sessionID, password, newPassword } = req.body
        const session = await Session.findOne({ sessionID: sessionID })
        if (session) {
            const user = await User.findOne({ _id: session.userID })
            if (user) {
                if (await bcrypt.compare(password, user.password)) {
                    const salt = bcrypt.genSaltSync(10)
                    const hash = bcrypt.hashSync(newPassword, salt)
                    User.findOneAndUpdate({ _id: session.userID }, { password: hash }, (err) => {
                        if (!err) {
                            res.send({
                                success: true,
                                message: 'Password has been changed sucessfully'
                            })
                        } else {
                            res.send({
                                success: false,
                                message: 'Error'
                            })
                        }
                    }
                    )
                } else {
                    res.send({
                        success: false,
                        message: 'Incorrect password'
                    })
                }
            } else {
                res.send({
                    success: false,
                    message: 'User not found'
                })
            }
        } else {
            res.send({
                success: false,
                message: 'Session not found'
            })
        }
    } catch (err) {
        console.log(err);
        res.send({
            success: false,
            message: 'Error'
        })
    }
}

export const changeEmail = async (req, res) => {
    try {
        const { sessionID, password, newEmail } = req.body
        if (sessionID && password && newEmail) {
            const session = await Session.findOne({ sessionID: sessionID })
            if (session) {
                const user = await User.findOne({ _id: session.userID })
                if (user) {
                    if (await bcrypt.compare(password, user.password)) {
                        const _email = await User.findOne({ email: newEmail })
                        if (_email) {
                            res.send({
                                success: false,
                                message: 'Email already exists'
                            })
                        } else {
                            User.findOneAndUpdate({ _id: session.userID }, { email: newEmail }, (err) => {
                                if (!err) {
                                    res.send({
                                        success: true,
                                        message: 'Email has been changed sucessfully'
                                    })
                                } else {
                                    res.send({
                                        success: false,
                                        message: 'Error'
                                    })
                                }
                            })
                        }
                    } else {
                        res.send({
                            success: false,
                            message: 'Incorrect password'
                        })
                    }
                } else {
                    res.send({
                        success: false,
                        message: "Error"
                    })
                }
            } else {
                res.send({
                    success: false,
                    message: 'Session not found'
                })
            }
        } else {
            res.send({
                success: false,
                message: 'Missing fields'
            })
        }
    } catch {
        res.send({
            success: false,
            message: "Error"
        })
    }
}

export const changeImage = async (req, res) => {
    const { sessionID } = req.body
    if (sessionID) {
        const session = await Session.findOne({ sessionID: sessionID })
        if (session) {
            User.findOneAndUpdate({ _id: session.userID }, { img: req.file ? req.file.path : null }, (err) => {
                if (!err) {
                    res.send({
                        success: true,
                        message: 'Image has been changed successfully'
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
                message: 'Session not found'
            })
        }
    } else {
        res.send({
            success: false,
            message: 'Missing fields'
        })
    }
}

export const changeLanguage = async (req, res) => {
    try {
        const { sessionID, lang } = req.body
        if (sessionID && lang) {
            const session = await Session.findOne({ sessionID: sessionID })
            if (session) {
                User.findOneAndUpdate({ _id: session.userID }, { lang: lang }, (err) => {
                    if (!err) {
                        res.send({
                            success: true,
                            message: 'Language has been changed successfully'
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
                    message: 'Session not found'
                })
            }
        } else {
            res.send({
                success: false,
                message: 'Missing fields'
            })
        }
    } catch (err) {
        res.send({
            success: false,
            message: 'Error'
        })
    }
}

export const changeUsername = async (req, res) => {
    try {
        const { sessionID, username } = req.body
        if (sessionID && username) {
            const session = await Session.findOne({ sessionID: sessionID })
            if (session) {
                User.findOneAndUpdate({ _id: session.userID }, { username: username }, (err) => {
                    if (!err) {
                        res.send({
                            success: true,
                            message: 'Username has been changed successfully'
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
                    message: 'Session not found'
                })
            }
        } else {
            res.send({
                success: false,
                message: 'Missing fields'
            })
        }
    } catch (err) {
        res.send({
            success: false,
            message: 'Error'
        })
    }
}

export const createUser = async (req, res) => {
    try {
        const { username, password, lang, role, email } = req.body
        const _email = await User.findOne({ email: email })
        if (_email) {
            res.send({
                success: false,
                message: 'Email already exists'
            })
        } else {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            const doc = new User({
                username: username,
                password: hash,
                role: role,
                img: 'uploads/default-avatar.png',
                lang: lang,
                email: email
            })

            const user = await doc.save()

            const _sessionID = random(user._id)
            new Session({
                sessionID: _sessionID,
                userID: user._id,
                createdAt: new Date()
            }).save()

            res.send({
                success: true,
                message: 'Registration successful',
                sessionID: _sessionID
            })
        }
    } catch (err) {
        res.send({
            success: false,
            message: 'Error'
        })
    }
}