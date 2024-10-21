import vine from '@vinejs/vine'

export const CheckoutValidationSchema = vine.compile(
    vine.object({
        firstname: vine.string(),
        lastname: vine.string(),
        address: vine.string(),
        city: vine.string(),
        phone: vine.string().maxLength(11),
        email: vine.string().email(),
        notes: vine.string().nullable(),
        total: vine.number(),
        downpayment: vine.number(),
        reference: vine.string(),
        paymentMethod: vine.enum(['cod','gcash','paymaya','paypal']),
        carts: vine.array(vine.object({}))
    })
)