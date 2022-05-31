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
    if (file.mimitype === 'image/jpeg' || file.mimitype === 'image/png' || file.mimitype === 'image/webp') {
        cb(null, true)
    } else {
        cb(new Error('Not an image type'), false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    if (username && password) {
        const user = await User.findOne({ username: username })
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
    const { username, password, lang } = req.body
    if (username && password && lang) {
        const _username = await User.findOne({ username: username })
        if (_username) {
            res.send({
                success: false,
                message: 'Username already exists'
            })
        } else {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            const user = new User({
                username: username,
                password: hash,
                role: 'user',
                img: 'uploads/default-avatar.png',
                lang: lang
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
    const { sessionID } = req.body
    if (sessionID) {
        const session = await Session.findOneAndDelete({ sessionID: sessionID })
        if (session) {
            User.findOneAndDelete({ _id: session.userID }).then(err => {
                if (!err) {
                    Session.deleteMany({ userID: session.userID }).then(err => {
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
})

router.post('/change-password', async (req, res) => {
    const { sessionID, password } = req.body
    if (sessionID && password) {
        const session = await Session.findOne({ sessionID: sessionID })
        if (session) {
            Session.deleteMany({ userID: session.userID }).then(err => {
                if (!err) {
                    const salt = bcrypt.genSaltSync(10)
                    const hash = bcrypt.hashSync(password, salt)
                    User.findOneAndUpdate(
                        { _id: session.userID },
                        { password: hash }
                    ).then(err => {
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
})

router.post('/create-user', async (req, res) => {
    const { username, password, lang, role, sessionID } = req.body
    if (username && password && lang && role && sessionID) {
        const session = await Session.findOne({ sessionID: sessionID })
        if (session) {
            const user = await User.findOne({ _id: session?.userID, role: 'admin' })
            if (user) {
                const _username = await User.findOne({ username: username })
                if (_username) {
                    res.send({
                        success: false,
                        message: 'Username already exists'
                    })
                } else {
                    const salt = bcrypt.genSaltSync(10)
                    const hash = bcrypt.hashSync(password, salt)
                    const user = new User({
                        username: username,
                        password: hash,
                        role: role,
                        img: 'uploads/default-avatar.png',
                        lang: lang
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