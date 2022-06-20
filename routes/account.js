import express from 'express'
import User from '../models/user.model.js'
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

router.post('/login', async (req, res) => {
    const { password, email } = req.body
    if (password && email) {
        const user = await User.findOne({ email: email })
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                const sessionID = random(user._id)
                new Session({
                    sessionID: sessionID,
                    userID: user._id,
                    createdAt: new Date()
                }).save(err => {
                    if (!err) {
                        res.send({
                            success: true,
                            message: 'Login successful',
                            sessionID: sessionID
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
                message: 'User not found'
            })
        }
    } else {
        res.send({
            success: false,
            message: 'Missing fields'
        })
    }
})

router.post('/register', async (req, res) => {
    const { username, password, lang, email, confirmPassword } = req.body
    if (username && password && lang && email && confirmPassword) {
        if (password === confirmPassword) {
            if (email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                const _email = await User.findOne({ email: email })
                if (_email) {
                    res.send({
                        success: false,
                        message: 'Email already exists'
                    })
                } else {
                    const salt = bcrypt.genSaltSync(10)
                    const hash = bcrypt.hashSync(password, salt)
                    let user = new User({
                        username: username,
                        password: hash,
                        role: 'user',
                        img: 'uploads/default-avatar.png',
                        lang: lang,
                        email: email
                    })

                    user.save(err => {
                        if (!err) {
                            const _sessionID = random(user._id)
                            new Session({
                                sessionID: _sessionID,
                                userID: user._id,
                                createdAt: new Date()
                            }).save(err => {
                                if (!err) {
                                    res.send({
                                        success: true,
                                        message: 'Registration successful',
                                        sessionID: _sessionID
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
                }
            } else {
                res.send({
                    success: false,
                    message: 'Email is not valid'
                })
            }
        } else {
            res.send({
                success: false,
                message: 'Passwords do not match'
            })
        }
    }
})

router.post('/login-session', async (req, res) => {
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
})

router.post('/delete-user', async (req, res) => {
    const { sessionID, password } = req.body
    if (sessionID) {
        const session = await Session.findOneAndDelete({ sessionID: sessionID })
        if (session) {
            const user = await User.findOne({ _id: session.userID })
            if (await bcrypt.compare(password, user.password)) {
                User.findOneAndDelete({ _id: session.userID }).then(err => {
                    Session.deleteMany({ userID: session.userID }).then(err => {
                        res.send({
                            success: true,
                            message: 'User was deleted succesfully'
                        })
                    })
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
})

router.post('/delete-session', async (req, res) => {
    const { sessionID } = req.body
    if (sessionID) {
        Session.findOneAndDelete({ sessionID: sessionID }).then(err => {
            res.send({
                success: true,
                message: 'Session was deleted successfully'
            })
        })
    } else {
        res.send({
            success: false,
            message: 'Missing fields'
        })
    }
})

router.post('/change-password', async (req, res) => {
    const { sessionID, password, newPassword, confirmNewPassword } = req.body
    if (sessionID && password && newPassword && confirmNewPassword) {
        const session = await Session.findOne({ sessionID: sessionID })
        if (session) {
            const user = await User.findOne({ _id: session.userID })
            if (await bcrypt.compare(password, user.password)) {
                if (newPassword === confirmNewPassword) {
                    if (!(newPassword === password)) {
                        const salt = bcrypt.genSaltSync(10)
                        const hash = bcrypt.hashSync(newPassword, salt)
                        User.findOneAndUpdate(
                            { _id: session.userID },
                            { password: hash }
                        ).then(err => {
                            res.send({
                                success: true,
                                message: 'Password has been changed sucessfully'
                            })
                        })
                    } else {
                        res.send({
                            success: false,
                            message: 'Password already exists'
                        })
                    }
                } else {
                    res.send({
                        success: false,
                        message: 'Passwords do not match'
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
                message: 'Session not found'
            })
        }
    } else {
        res.send({
            success: false,
            message: 'Missing fields'
        })
    }
})

router.post('/change-email', async (req, res) => {
    const { sessionID, password, newEmail } = req.body
    if (sessionID && password && newEmail) {
        const session = await Session.findOne({ sessionID: sessionID })
        if (session) {
            const user = await User.findOne({ _id: session.userID })
            if (await bcrypt.compare(password, user.password)) {
                const _email = await User.findOne({ email: newEmail })
                if (_email) {
                    res.send({
                        success: false,
                        message: 'Email already exists'
                    })
                } else {
                    User.findOneAndUpdate(
                        { _id: session.userID },
                        { email: newEmail }
                    ).then(err => {
                        res.send({
                            success: true,
                            message: 'Email has been changed sucessfully'
                        })
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
                message: 'Session not found'
            })
        }
    } else {
        res.send({
            success: false,
            message: 'Missing fields'
        })
    }
})

router.post('/change-img', upload.single('img'), async (req, res) => {
    const { sessionID } = req.body
    if (sessionID) {
        const session = await Session.findOne({ sessionID: sessionID })
        if (session) {
            User.findOneAndUpdate(
                { _id: session.userID },
                { img: req.file ? req.file.path : null }
            ).then(err => {
                res.send({
                    success: true,
                    message: 'Image has been changed successfully'
                })
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
})

router.post('/change-lang', async (req, res) => {
    const { sessionID, lang } = req.body
    if (sessionID && lang) {
        const session = await Session.findOne({ sessionID: sessionID })
        if (session) {
            User.findOneAndUpdate(
                { _id: session.userID },
                { lang: lang }
            ).then(err => {
                // if (!err) {
                //     res.send({
                //         success: true,
                //         message: 'Language has been changed successfully'
                //     })
                // } else {
                //     res.send({
                //         success: false,
                //         message: 'Error'
                //     })
                // }
                res.send({
                    success: true,
                    message: 'Language has been changed successfully'
                })
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
})

router.post('/change-username', async (req, res) => {
    const { sessionID, username } = req.body
    if (sessionID && username) {
        const session = await Session.findOne({ sessionID: sessionID })
        if (session) {
            User.findOneAndUpdate(
                { _id: session.userID },
                { username: username }
            ).then(err => {
                // if (!err) {
                //     res.send({
                //         success: true,
                //         message: 'Language has been changed successfully'
                //     })
                // } else {
                //     res.send({
                //         success: false,
                //         message: 'Error'
                //     })
                // }
                res.send({
                    success: true,
                    message: 'Username has been changed successfully'
                })
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
})

router.post('/create-user', async (req, res) => {
    const { username, password, lang, role, sessionID, email } = req.body
    if (username && password && lang && role && sessionID && email) {
        const session = await Session.findOne({ sessionID: sessionID })
        if (session) {
            const user = await User.findOne({ _id: session?.userID, role: 'admin' })
            if (user) {
                const _email = await User.findOne({ email: email })
                if (_email) {
                    res.send({
                        success: false,
                        message: 'Email already exists'
                    })
                } else {
                    const salt = bcrypt.genSaltSync(10)
                    const hash = bcrypt.hashSync(password, salt)
                    const user = new User({
                        username: username,
                        password: hash,
                        role: role,
                        img: 'uploads/default-avatar.png',
                        lang: lang,
                        email: email
                    }).save(err => {
                        if (!err) {
                            const _sessionID = random(user._id)
                            new Session({
                                sessionID: _sessionID,
                                userID: user._id,
                                createdAt: new Date()
                            }).save(err => {
                                if (!err) {
                                    res.send({
                                        success: true,
                                        message: 'Registration successful',
                                        sessionID: _sessionID
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
                }
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
    } else {
        res.send({
            success: false,
            message: 'Missing fields'
        })
    }
})

export default router