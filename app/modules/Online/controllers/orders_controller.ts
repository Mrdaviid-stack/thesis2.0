import type { HttpContext } from '@adonisjs/core/http'
import Order from '../../CMS/Websites/models/order.js'
import Transaction from '../../CMS/Websites/models/transaction.js'

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
                price: orderItem.price,
                status: orders.transaction.status,
                rider: orders.transaction.riderName,
            }))
        })

        return view.render('pages/online/accounts/orders', { orders: orders.filter(order => order.status !== 'cancelled') })
    }

    async cancelOrder({ response, params }: HttpContext) {

        const TransactionQuery = await Transaction.find(params.id)

        TransactionQuery?.merge({ status: 'request_cancel' }).save();

        return response.status(200).json({ message: 'Cancel Requested!' })
    }

    async cancledConfirm({ response, params }: HttpContext) {

        const TransactionQuery = await Transaction.find(params.id)

        TransactionQuery?.merge({ status: 'cancelled' }).save();

        return response.status(200).json({ message: 'Cancel Requested!' })

    }

}