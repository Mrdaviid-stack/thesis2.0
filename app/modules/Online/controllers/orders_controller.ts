import type { HttpContext } from '@adonisjs/core/http'
import Order from '../../CMS/Websites/models/order.js'
import Transaction from '../../CMS/Websites/models/transaction.js'
import historyService from '../../CMS/Reports/services/historyServices.js'
import Exchange from '../../CMS/Websites/models/exchange.js'

export default class OrdersController {
  async index({ view, response, auth }: HttpContext) {
    if (!(await auth.check())) {
      return response.redirect('/login')
    }
    const ordersQuery = await Order.query()
      .where('userId', auth.user?.id!)
      .preload('orderItems', (orderItem) =>
        orderItem.preload('productVariant', (productVariant) => productVariant.preload('product'))
      )
      .preload('transaction')

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const orders = ordersQuery.flatMap((orders) => {
      return orders.orderItems.map((orderItem) => ({
        transactionId: orders.transaction?.id,
        transactionInvoice: orders.transaction?.invoice,
        deliveryStatus: orders.transaction?.deliveryStatus,
        productName: orderItem.productVariant.product.name,
        productImage: orderItem.productVariant.image,
        productColor: orderItem.productVariant.color,
        productStorage: orderItem.productVariant.storage,
        quantity: orderItem.quantity,
        price: orderItem.price,
        status: orders.transaction?.status,
        rider: orders.transaction?.riderName,
        downpayment: orders.transaction?.downpayment,
        balance: (Number(orderItem.price) !== Number(orders.transaction?.downpayment)) ? (Number(orderItem.price) - Number(orders.transaction?.downpayment)) : 0,
        customerName: `${orders.firstName}, ${orders.lastName}`,
      }))
    })

    return view.render('pages/online/accounts/orders', {
      orders: orders.filter((order) => order.status !== 'cancelled'),
    })
  }

  async cancelOrder({ response, params, auth }: HttpContext) {
    const TransactionQuery = await Transaction.find(params.id)

    TransactionQuery?.merge({ status: 'request_cancel' }).save()

    await historyService(auth.user?.lastname!, `Cancel Order`)

    return response.status(200).json({ message: 'Cancel Requested!' })
  }

  async cancledConfirm({ response, params, auth }: HttpContext) {
    const TransactionQuery = await Transaction.find(params.id)

    TransactionQuery?.merge({ status: 'cancelled' }).save()

    await historyService(auth.user?.lastname!, `Cancel Confirm`)

    return response.status(200).json({ message: 'Cancel Requested!' })
  }

  async exchangeOrder({ request, response, params, auth }: HttpContext) {
    const { proof, reason, description } = request.body();

    await Exchange.create({
      transactionId: params.id,
      reason: reason as 'Faulty Camera' | 'Software Glitching / Bug' | 'Wrong Item' | 'Damaged Item' | 'Other',
      description: description || null, 
      proof: proof || null,
    })

    await historyService(auth.user?.lastname!, `Exchange Order`)
    return response.status(200).json({ message: 'Exchange Requested!'})

  }
}
