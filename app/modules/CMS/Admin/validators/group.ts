import vine from '@vinejs/vine'

export const GroupValidationSchema = vine.compile(
    vine.object({
        id: vine.number().optional().nullable(),
        name: vine.string().minLength(3).maxLength(70),
        description: vine.string().minLength(3).trim().maxLength(100),
    })
)