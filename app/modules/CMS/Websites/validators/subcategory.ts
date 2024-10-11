import vine from '@vinejs/vine'

export const SubcategoryValidationSchema = vine.compile(
    vine.object({
        id: vine.number().optional().nullable(),
        categoryId: vine.string(),
        name: vine.string().minLength(3).maxLength(100),
        description: vine.string().minLength(3).trim().maxLength(100),
        status: vine.enum(['active','inactive'])
    })
)