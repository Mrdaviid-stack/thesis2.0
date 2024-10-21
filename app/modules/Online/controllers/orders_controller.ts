import type { HttpContext } from '@adonisjs/core/http'
import Order from '../../CMS/Websites/models/order.js'

export default class OrdersController {

    async index({ view, response, auth }: HttpContext) {
        if (!await auth.check()) {
            return response.redirect('/login')
        }
        const ordersQuery = await Order.query().where('userId', auth.user?.id!).preload('orderItems', (orderItem) => orderItem.preload('productVariant', (productVariant) => productVariant.preload('product'))).preload('transaction')

        const orders = ordersQuery.flatMap((orders) => {
            return orders.orderItems.map((orderItem) => ({
                transactionId: orders.transaction.id,
                transactionInvoice: orders.transaction.invoice,
                deliveryStatus: orders.transaction.deliveryStatus,
                productName: orderItem.productVariant.product.name,
                productImage: orderItem.productVariant.image,
                productColor: orderItem.productVariant.color,
                productStorage: orderItem.productVariant.storage,
                quantity: orderItem.quantity,
                price: orderItem.price
            }))
        })

        return view.render('pages/online/accounts/orders', { orders })
    }

}