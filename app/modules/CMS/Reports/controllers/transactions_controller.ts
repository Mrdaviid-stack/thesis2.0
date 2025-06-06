import type { HttpContext } from '@adonisjs/core/http'
import Order from '../../Websites/models/order.js'
import historyService from '../services/historyServices.js'
import moment from 'moment'

export default class TransactionsController {
  async index({ view }: HttpContext) {
    //await historyService(auth.user?.firstname!, `View Transaction Reports Page`)
    return view.render('pages/cms/reports/inventory/transaction_index')
  }

  async generate({ request, response, auth }: HttpContext) {
    let { start, end } = request.qs()

    const query = await Order.query()
      .preload('orderItems', (orderItems) =>
        orderItems.preload('productVariant', (productVariantQuery) =>
          productVariantQuery.preload('product')
        )
      )
      .preload('transaction', (transactionQuery) =>
        transactionQuery.whereBetween('created_at', [`${start} 00:00:00`, `${end} 23:59:59`])
      )

    let transaction = query.map((trn) => ({
      ...trn.toJSON(),
    }))

    console.log(transaction)

    const newTransaction = []

    for (const trn of transaction) {
      if (trn.transaction !== null && trn.transaction.status !== 'reject') {
        newTransaction.push({
          fullname: `${trn.firstName}, ${trn.lastName}`,
          invoice: trn.transaction.invoice,
          reference: trn.transaction.reference,
          status: !trn.transaction.status ? (trn.transaction.deliveryStatus === 'to_ship' ? 'Out for delivery' : trn.transaction.deliveryStatus) : trn.transaction.status,
          amount: trn.transaction.totalAmount,
          product: trn.orderItems.map((item: any) => item.productVariant.product.name),
          orderCreated: moment.parseZone(trn.createdAt).utcOffset(8).format("YYYY-MM-DD, h:mm:ss a"),
          orderSettled: (trn.transaction.paidStatus === 'fullypaid') ? moment.parseZone(trn.transaction.updatedAt).utcOffset(8).format("YYYY-MM-DD, h:mm:ss a") : 'Pending'
        })
      }
    }

    await historyService(auth.user?.firstname!, `Generate Transactions`)
    return response.status(200).json(newTransaction)
  }
}
