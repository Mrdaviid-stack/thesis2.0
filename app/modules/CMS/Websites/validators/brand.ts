import vine from '@vinejs/vine'

export const BrandValidationSchema = vine.compile(
    vine.object({
        id: vine.number().nullable(),
        name: vine.string().minLength(3).maxLength(100),
        description: vine.string().minLength(3).trim().maxLength(1000),
        status: vine.enum(['active', 'inactive'])
    })
)