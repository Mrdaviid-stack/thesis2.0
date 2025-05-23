import vine from '@vinejs/vine'

export const UserValidationSchema = vine.compile(
    vine.object({
        firstname: vine.string().minLength(3).maxLength(100),
        lastname: vine.string().minLength(3).maxLength(100),
        email: vine.string().email(),
        number: vine.string().optional(),
        address: vine.string().minLength(3),
        group: vine.number().optional()
    })
)