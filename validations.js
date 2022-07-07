export const registerValidation = (req) => {
    const { username, password, email, confirmPassword, lang } = req.body
    const errors = []

    const language = req.query.lang
    if (language === 'en') {
        if (username && password && email && confirmPassword && lang) {
            if (username.length < 3) {
                errors.push('Username must be longer than 3 symbols')
            }

            if (password === confirmPassword) {
                if (password.length < 3) {
                    errors.push('Password must be langoer than 3 symbols')
                }
            } else {
                errors.push('Passwords do not match')
            }

            if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                errors.push('Email is not valid')
            }
        } else {
            errors.push('Missing fields')
        }
    } else if (language === 'ru') {
        if (username && password && email && confirmPassword && lang) {
            if (username.length < 3) {
                errors.push('Никнейм должен быть больше 3 символов')
            }

            if (password === confirmPassword) {
                if (password.length < 3) {
                    errors.push('Пароль должен быть больше 3 символов')
                }
            } else {
                errors.push('Пароли не совпадают')
            }

            if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                errors.push('Неверная электронная почта')
            }
        } else {
            errors.push('Заполните все поля')
        }
    }

    return errors
}

export const loginValidation = (req) => {
    const { email, password } = req.body
    const errors = []

    const language = req.query.lang
    if (language === 'en') {
        if (email && password) {
        } else {
            errors.push('Missing fields')
        }
    } else if (language === 'ru') {
        if (email && password) {
        } else {
            errors.push('Заполните все поля')
        }
    }

    return errors
}

export const changePasswordValidation = (req) => {
    const { password, newPassword, confirmNewPassword } = req.body
    const errors = []

    const language = req.query.lang
    if (language === 'en') {
        if (newPassword && confirmNewPassword && password) {
            if (newPassword === confirmNewPassword) {
                if (!(newPassword === password)) {
                    if (newPassword.length < 3) {
                        errors.push('Password must be longer than 3 symbols')
                    }
                } else {
                    errors.push('Password already exists')
                }
            } else {
                errors.push('Passwords do not match')
            }
        } else {
            errors.push('Missing fields')
        }
    } else if (language === 'ru') {
        if (newPassword && confirmNewPassword && password) {
            if (newPassword === confirmNewPassword) {
                if (!(newPassword === password)) {
                    if (newPassword.length < 3) {
                        errors.push('Пароль должен быть больше 3 символов')
                    }
                } else {
                    errors.push('Придумайте новый пароль')
                }
            } else {
                errors.push('Пароли не совпадают')
            }
        } else {
            errors.push('Заполните все поля')
        }
    }

    return errors
}

export const createUserValidation = (req) => {
    const { username, password, email, role, lang, confirmPassword } = req.body
    const errors = []

    const language = req.query.lang
    if (language === 'en') {
        if (username && password && email && role && lang && confirmPassword) {
            if (username.length < 3) {
                errors.push('Username must be longer than 3 symbols')
            }

            if (password === confirmPassword) {
                if (password.length < 3) {
                    errors.push('Password must be langoer than 3 symbols')
                }
            } else {
                errors.push('Passwords do not match')
            }

            if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                errors.push('Email is not valid')
            }
        } else {
            errors.push('Missing fields')
        }
    } else if (language === 'ru') {
        if (username && password && email && role && lang && confirmPassword) {
            if (username.length < 3) {
                errors.push('Никнейм должен быть больше 3 символов')
            }

            if (password === confirmPassword) {
                if (password.length < 3) {
                    errors.push('Пароль должен быть больше 3 символов')
                }
            } else {
                errors.push('Пароли не совпадают')
            }

            if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                errors.push('Неверная электронная почта')
            }
        } else {
            errors.push('Заполните все поля')
        }
    }

    return errors
}

export const createCategoryValidation = (req) => {
    const { name, code } = req.body
    const errors = []

    const language = req.query.lang
    if (language === 'en') {
        if (name && code) {
            if (name.length < 3) {
                errors.push('Name must be longer than 3 symbols')
            }

            if (code.length < 3) {
                errors.push('Code must be longer that 3 symbols')
            }
        } else {
            errors.push('Missing fields')
        }
    } else if (language === 'ru') {
        if (name && code) {
            if (name.length < 3) {
                errors.push('Название должно быть больше 3 символов')
            }

            if (code.length < 3) {
                errors.push('Код должен быть больше 3 символов')
            }
        } else {
            errors.push('Заполните все поля')
        }
    }

    return errors
}

export const createCollectionValidation = (req) => {
    const { name, description, code } = req.body
    const errors = []

    const language = req.query.lang
    if (language === 'en') {
        if (name && code && description) {
            if (name.length < 3) {
                errors.push('Name must be longer than 3 symbols')
            }

            if (code.length < 3) {
                errors.push('Code must be longer that 3 symbols')
            }

            if (description.length < 5) {
                errors.push('Description must be longer that 5 symbols')
            }
        } else {
            errors.push('Missing fields')
        }
    } else if (language === 'ru') {
        if (name && code && description) {
            if (name.length < 3) {
                errors.push('Название должно быть больше 3 символов')
            }

            if (code.length < 3) {
                errors.push('Код должен быть больше 3 символов')
            }

            if (description.length < 5) {
                errors.push('Описание должен быть больше 3 символов')
            }
        } else {
            errors.push('Заполните все поля')
        }
    }

    return errors
}