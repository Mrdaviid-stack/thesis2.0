import vine from '@vinejs/vine'

export const SignInValidatorSchema = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string().minLength(3),
        isRememberMe: vine.accepted().optional(),
    })
 
)