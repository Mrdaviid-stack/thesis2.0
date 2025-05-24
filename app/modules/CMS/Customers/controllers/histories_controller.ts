import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '../../Websites/models/transaction.js'
import db from '@adonisjs/lucid/services/db'
//import historyService from '../../Reports/services/historyServices.js'
import moment from 'moment'

export default class HistoriesController {
  async index({ view }: HttpContext) {
    return view.render('pages/cms/customers/history/history_index')
  }

  async generate({ request, response }: HttpContext) {
    let { start, end } = request.qs()

    const query = await Transaction.query()
      .select(
        'id',
        'order_id',
        'invoice',
        'reference',
        'delivery_status',
        'payment_method',
        'total_amount',
        'updated_at'
      )
      .whereBetween('created_at', [`${start} 00:00:00.000`, `${end} 23:59:59.000`])
      .preload('order', (orderQuery) => {
        orderQuery
          .select(db.raw("CONCAT(first_name, ' ', last_name) AS fullname"))
          .preload('orderItems', (orderItemQuery) =>
            orderItemQuery.preload('productVariant', (productVariantQuery) => {
              productVariantQuery.preload('product', (productQuery) => productQuery.select('*'))
            })
          )
      })
      .orderBy('created_at', 'desc')

    const purchaseHistory = query.map((data) => ({
      ...data.toJSON(),
      // @ts-ignore
      fullname: data.$preloaded.order.$extras.fullname,
      updatedAt: moment
        .parseZone(data.updatedAt?.toISO())
        .utcOffset(8)
        .format('dddd, MMMM Do YYYY, h:mm:ss a'),
      totalAmount: new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(
        Number(data.totalAmount)
      ),
    }))

    return response.status(200).json({ data: purchaseHistory })
  }
}
