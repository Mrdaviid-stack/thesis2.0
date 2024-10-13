import vine from '@vinejs/vine'

export const ProductValidationSchema = vine.compile(
    vine.object({
        id: vine.number().optional(),
        categoryId: vine.number(),
        subcategoryId: vine.number(),
        name: vine.string().minLength(3).maxLength(100),
        modelNumber: vine.string(),
        content: vine.string().minLength(3),
        status: vine.enum(['publish','draft']),
        variants: vine.array(vine.object({
            id: vine.number().optional(),
            color: vine.string().nullable(),
            storage: vine.string().nullable(),
            stock: vine.string().nullable(),
            feature: vine.string().nullable(),
            image: vine.string().nullable(),
            sku: vine.string().nullable(),
            price: vine.number().nullable(),
        }))
    })
 
)