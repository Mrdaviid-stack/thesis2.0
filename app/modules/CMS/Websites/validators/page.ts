import vine from '@vinejs/vine'

export const PageValidationSchema = vine.compile(
    vine.object({
        id: vine.number().optional().nullable(),
        name: vine.string().minLength(3),
        content: vine.string(),
        status: vine.string()
    })
)