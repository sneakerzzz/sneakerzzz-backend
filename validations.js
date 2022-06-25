export const registerValidation = (req) => {
    const { username, password, email, confirmPassword, lang } = req.body
    const errors = []

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

    return errors
}

export const loginValidation = (req) => {
    const { email, password } = req.body
    const errors = []

    if (email && password) {
    } else {
        errors.push('Missing fields')
    }

    return errors
}

export const changePasswordValidation = (req) => {
    const { password, newPassword, confirmNewPassword } = req.body
    const errors = []

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

    return errors
}

export const createUserValidation = (req) => {
    const { username, password, email, role, lang, confirmPassword } = req.body
    const errors = []

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

    return errors
}