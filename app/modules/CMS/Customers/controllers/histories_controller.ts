import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '../../Websites/models/transaction.js'
import db from '@adonisjs/lucid/services/db'

export default class HistoriesController {

    async index({ view, request }: HttpContext) {
        
        const page = request.input('page', 1)

        const histories = await Transaction.query().select('id','order_id','reference','delivery_status','payment_method')
            .preload('order', (orderQuery) => {
                orderQuery
                    .select(db.raw('CONCAT(first_name, \' \', last_name) AS fullname'))
                    .preload('orderItems', (orderItemQuery) => 
                        orderItemQuery.preload('productVariant', (productVariantQuery) => {
                            productVariantQuery.preload('product', (productQuery) => productQuery.select('*'))
                        })
                )
            }).paginate(page, 10)

        const baseUrl = request.url().split('?',1)[0]
        histories?.baseUrl(baseUrl)

        return view.render('pages/cms/customers/history/history_index', { histories })
    }

}