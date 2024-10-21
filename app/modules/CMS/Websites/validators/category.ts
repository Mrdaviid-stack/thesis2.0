import vine from '@vinejs/vine'

export const CategoryValidationSchema = vine.compile(
    vine.object({
        id: vine.number().optional(),
        name: vine.string().minLength(3).maxLength(100),
        description: vine.string().minLength(3).maxLength(100),
        status: vine.string()
    })
)