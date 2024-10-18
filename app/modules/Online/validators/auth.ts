import vine from '@vinejs/vine'

export const loginValidationSchema = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string(),
        isRememberMe: vine.boolean().optional(),
    })
)

export const registerValidationSchema = vine.compile(
    vine.object({
        firstname: vine.string().minLength(2).maxLength(100),
        lastname: vine.string().minLength(2).maxLength(100),
        email: vine.string().email(),
    }))

export const UpdateAccountValidationSchema = vine.compile(
    vine.object({
        firstname: vine.string().minLength(2).maxLength(100),
        lastname: vine.string().minLength(2).maxLength(100),
        email: vine.string().email(),
        address: vine.string(),
        password: vine.string().optional(),
        confirmPassword: vine.string().sameAs('password').optional(),
    })
)