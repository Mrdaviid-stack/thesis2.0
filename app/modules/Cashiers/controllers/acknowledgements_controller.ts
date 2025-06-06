import type { HttpContext } from '@adonisjs/core/http'
import Order from '../../CMS/Websites/models/order.js'
import Transaction from '../../CMS/Websites/models/transaction.js'
import historyService from '../../CMS/Reports/services/historyServices.js'
import mail from '@adonisjs/mail/services/main'
import moment from 'moment'

export default class AcknowledgementsController {
  async index({ view, response, auth }: HttpContext) {
    const guard = await auth.user?.related('groups').query()
    if (guard![0].name === 'Riders') {
      return response.redirect().toPath('/cashiers/order-tracking')
    }

    const ordersQuery = await Order.query()
      .preload('orderItems', (orderItem) =>
        orderItem.preload('productVariant', (productVariant) => productVariant.preload('product'))
      )
      .preload('transaction', (transaction) => transaction.where('orderType', 'online'))
      .preload('user', (userQuery) => userQuery.preload('orders'))

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const orders = ordersQuery.flatMap((orders) => {
      return orders.orderItems.map((orderItem) => ({
        orderTransactionId: orders.transaction?.id,
        orderDeliveryStatus: orders.transaction?.deliveryStatus,
        orderInvoice: orders.transaction?.invoice,
        orderPaymentMethod: orders.transaction?.paymentMethod,
        orderPaymentReference: orders.transaction?.reference,
        orderDownpayment: this.CurrencyFormatter(orders.transaction?.downpayment),
        orderTotalAmount: this.CurrencyFormatter(Number(orders.transaction?.totalAmount)),
        orderBalance: this.CurrencyFormatter(
          Number(orders.transaction?.totalAmount) - Number(orders.transaction?.downpayment)
        ),
        orderProductName: orderItem.productVariant?.product.name,
        orderProductSKU: orderItem.productVariant?.sku,
        orderProductColor: orderItem.productVariant?.color,
        orderProductStorage: orderItem.productVariant?.storage,
        orderProductImage: orderItem.productVariant?.image,
        customerName: `${orders.firstName} ${orders.lastName}`,
        customerAddress: orders.address + " " + orders.city,
        orderTransactionStatus: orders.transaction?.status,
        receipt: orders.transaction?.receipt,
      }))
    }).filter(order => order.orderTransactionStatus !== 'reject' && order.orderTransactionStatus !== 'cancelled')

    console.log(orders)

    return view.render('pages/cashiers/awknowledgements', {
      orders: orders.filter(
        (order) =>
          // eslint-disable-next-line eqeqeq
          order.orderDeliveryStatus == 'pending'
      ),
    })
  }

  async acknowledge({ response, params, auth }: HttpContext) {
    const transaction = await Transaction.findOrFail(params.transactionId)
    await transaction.merge({ deliveryStatus: 'processing' }).save()
    await historyService(auth.user?.firstname!, `Acknowledge Order`)
    return response.status(201).json({ message: 'Order acknowledge successfully' })
  }

  async reject({ response, params, auth }: HttpContext) {
    const transaction = await Transaction.findOrFail(params.transactionId)
    await transaction.merge({ status: 'reject' }).save()
    await historyService(auth.user?.firstname!, `Order rejected`)
    return response.status(201).json({ message: 'Order rejected successfully' })
  }

  private CurrencyFormatter(number: number) {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(number)
  }


  async exchangeIndex({ view }: HttpContext) {

    const exchangeQuery = await Transaction.query().where('status', 'returned').preload('exchange').preload('order')

    const exchange = exchangeQuery.map((exchange) => ({
      transactionId: exchange.id,
      invoice: exchange.invoice,
      customerName: `${exchange.order?.firstName} ${exchange.order?.lastName}`,
      status: exchange.status,
      proof: exchange.exchange?.proof,
      reason: exchange.exchange?.reason,
      description: exchange.exchange?.description,
    }))

    return view.render('pages/cashiers/exchange', { exchange: exchange })
  }

  
  async acceptExchange({ response, params, auth }: HttpContext) {
    const TransactionQuery = await Transaction.findOrFail(params.transactionId)

    TransactionQuery.status = 'exchange'
    TransactionQuery.deliveryStatus = 'processing'
    TransactionQuery.riderName = ''

    TransactionQuery.save()

    const transaction = await Transaction.query().where('id', params.transactionId).preload('order').firstOrFail()

    await mail.send((message) => {
      message
        .to(`${transaction.order?.email}`)
        .from('admin@yourdomain.com')
        .subject(`For Replacement ${TransactionQuery.invoice}`)
        .htmlView('emails/replace-confirmation', {
          invoice: transaction.invoice,
          description: `Hi, Mr/Mrs. ${transaction.order.firstName}, rider is on the way for exchange and please prepare the device, box, and receipt for verification.`,
          orderDate: moment(transaction.createdAt).format('MMM Do YY'),
          orderDelivered: moment(transaction.order?.updatedAt).format('MMM Do YY'),
        })
    })

    await historyService(auth.user?.lastname!, `Accept Exchange Order`)

    return response.status(200).json({ message: 'Exchange Accepted!' })
  }
}
