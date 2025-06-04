import vine from '@vinejs/vine'

// Custom rule to check if currentPassword matches the user's password in DB
const currentPasswordMatches = vine.createRule(async (value, _, context) => {
    // You must provide user info in context.meta
    const user = context.meta?.user
    if (!user) {
        return context.report('User context missing', 'currentPasswordMatches', context)
    }
    // Replace this with your password check logic
    const isMatch = await user.verifyPassword(value)
    if (!isMatch) {
        return context.report('Current password is incorrect', 'currentPasswordMatches', context)
    }
})

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
        number: vine.string(),
        currentPassword: vine.string().optional(),
        password: vine.string().optional(),
        confirmPassword: vine.string().sameAs('password').optional(),
    })
)
