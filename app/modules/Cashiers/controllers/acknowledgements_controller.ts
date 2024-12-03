import type { HttpContext } from '@adonisjs/core/http'
import Order from '../../CMS/Websites/models/order.js'
import Transaction from '../../CMS/Websites/models/transaction.js'

export default class AcknowledgementsController {
    async index({ view, response, auth }: HttpContext) {

        const guard = await auth.user?.related('groups').query()
        if (guard![0].name === 'Riders') {
            return response.redirect().toPath('/cashiers/order-tracking')
        }


        const ordersQuery = await Order.query()
            .preload('orderItems', (orderItem) => 
                orderItem.preload('productVariant', (productVariant) => 
                    productVariant
                        .preload('product')
                )
            )
            .preload('transaction', (transaction) => 
                transaction
                    .where('orderType', 'online')
                    
            )
            .preload('user')

        const orders = ordersQuery.flatMap((orders) => {
            return orders.orderItems.map((orderItem) => ({
                orderTransactionId: orders.transaction?.id,
                orderDeliveryStatus: orders.transaction?.deliveryStatus,
                orderInvoice: orders.transaction?.invoice,
                orderPaymentMethod: orders.transaction?.paymentMethod,
                orderPaymentReference: orders.transaction?.reference,
                orderDownpayment: this.CurrencyFormatter(orders.transaction?.downpayment),
                orderTotalAmount: this.CurrencyFormatter(Number(orders.transaction?.totalAmount)),
                orderBalance: this.CurrencyFormatter(Number(orders.transaction?.totalAmount) - Number(orders.transaction?.downpayment)),
                orderProductName: orderItem.productVariant?.product.name,
                orderProductSKU: orderItem.productVariant?.sku,
                orderProductColor: orderItem.productVariant?.color,
                orderProductStorage: orderItem.productVariant?.storage,
                orderProductImage: orderItem.productVariant?.image,
                customerName: `${orders.user.firstname} ${orders.user.lastname}`
            }))
        })

        return view.render('pages/cashiers/awknowledgements', { orders: orders.filter(order => order.orderDeliveryStatus == 'pending') })
    }

    async acknowledge({ response, params }: HttpContext) {
        const transaction = await Transaction.findOrFail(params.transactionId)
        await transaction.merge({ deliveryStatus: 'processing' }).save()
        return response.status(201).json({message: 'Order acknowledge successfully' })
    }

    private CurrencyFormatter(number: number) {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP'}).format(number)
    }
}