import vine from '@vinejs/vine'

export const UserValidationSchema = vine.compile(
    vine.object({
        firstname: vine.string().minLength(3).maxLength(100),
        lastname: vine.string().minLength(3).maxLength(100),
        email: vine.string().email(),
        address: vine.string().minLength(3),
    })
)