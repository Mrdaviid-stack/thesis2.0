import type { HttpContext } from '@adonisjs/core/http'
import Order from '../../CMS/Websites/models/order.js'
import OrderItem from '../../CMS/Websites/models/order_item.js'
import Transaction from '../../CMS/Websites/models/transaction.js'
import Cart from '../../CMS/Websites/models/cart.js'
import { customAlphabet } from 'nanoid'
import ProductVariant from '../../CMS/Websites/models/product_variant.js'
import mail from '@adonisjs/mail/services/main'
import moment from 'moment'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)

export default class CheckoutsController {
    async index({ view,response,auth }: HttpContext) {
        if (!await auth.check()) {
            return response.redirect('/login')
        }
        return view.render('pages/online/checkout')
    }

    async checkout({ request, auth }: HttpContext) { 
        const data = request.body()
        const order = await Order.create({
            userId: auth.user?.id,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            city: data.city,
            phone: data.phone,
            email: data.email ? data.email : auth.user?.email,
            note: data.note,
        })

        data.carts.map(async (cart:any) => {
            const variant = await ProductVariant.find(cart.id)
            const totalStock = parseInt(variant?.stock!) - parseInt(cart.qty)
            await variant?.merge({ stock: `${totalStock}`}).save()
        })

        const carts = data.carts.map((cart:any) => ({
            orderId: order.id,
            productVariantId: cart.id,
            quantity: cart.qty,
            price: cart.price,
        }))
        await OrderItem.createMany(carts)
        const transaction = await Transaction.create({
            orderId: order.id,
            invoice: `INV-${nanoid()}`,
            paymentMethod: data.paymentMethod,
            totalAmount: data.total,
            deliveryStatus: 'pending',
            orderType: 'online',
            reference: data.reference,
            downpayment: data.downpayment,
        })
        await Cart.query().where('userId', auth.user!.id).delete()

        const EMAIL = data.email ? data.email : auth.user!.email

        await mail.send((message) => {
            message
               .to(EMAIL)
               .from('admin@yourdomain.com')
               .subject(`${transaction.invoice}`)
               .htmlView('emails/order-confirmation', {
                    invoice: transaction.invoice,
                    date: moment(transaction.createdAt).format('MMM Do YY'),
                    products: data.carts,
                    totalAmount: data.total,
                    downpayment: data.downpayment,
                    paymentMethod: data.paymentMethod,
                    reference: data.reference,
                    lastname: data.lastName
                })
        })
    }
}