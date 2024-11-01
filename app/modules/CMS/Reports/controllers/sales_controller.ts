import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '../../Websites/models/transaction.js'

import _ from 'lodash'

export default class SalesController {

    async index({ view }: HttpContext) {
        return view.render('pages/cms/reports/sales/sales_index')
    }

    async generate({ request,response }: HttpContext) {
        let { start, end } = request.qs()

        const transactionQuery = await Transaction.query()
            .whereBetween('created_at', [`${start} 00:00:00.000`, `${end} 23:59:59.000`])

        const totalSales = _.sumBy(transactionQuery, (transaction) => parseInt(transaction.totalAmount))

        return response.status(200).json({
            totalSales: new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP'}).format(totalSales),
            transactions: transactionQuery
        })
    }

}