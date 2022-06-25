import express from 'express'
import * as AccountController from '../controllers/account.controller.js'
import multer from 'multer'
import { handleChangePasswordValidation, handleLoginValidation, handleRegisterValidation, handleCreateUserValidation, handleCheckAdmin } from '../utils/index.js'
import * as fs from 'fs'

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
          fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
      },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + '-' + file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})

const router = express.Router()

router.post('/login', handleLoginValidation, AccountController.login)
router.post('/login-session', AccountController.loginSession)
router.post('/register', handleRegisterValidation, AccountController.register)
router.post('/create-user', handleCheckAdmin, handleCreateUserValidation, AccountController.createUser)

router.post('/delete-user', AccountController.deleteUser)
router.post('/delete-session', AccountController.deleteSession)

router.post('/change-password', handleChangePasswordValidation, AccountController.changePassword)
router.post('/change-email', AccountController.changeEmail)
router.post('/change-img', upload.single('img'), AccountController.changeImage)
router.post('/change-lang', AccountController.changeLanguage)
router.post('/change-username', AccountController.changeUsername)

export default router