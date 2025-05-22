import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '../../Websites/models/transaction.js'

import _ from 'lodash'
import historyService from '../services/historyServices.js'

export default class SalesController {

    async index({ view, auth }: HttpContext) {
        await historyService(auth.user?.firstname!, `View Sales Reports Page`)
        return view.render('pages/cms/reports/sales/sales_index')
    }

    async generate({ request,response, auth }: HttpContext) {
        let { start, end } = request.qs()

        const transactionQuery = await Transaction.query()
            .whereBetween('created_at', [`${start} 00:00:00`, `${end} 23:59:59`])

        const totalSales = _.sumBy(transactionQuery, (transaction) => parseInt(transaction.totalAmount))
        await historyService(auth.user?.firstname!, `Generate Sales`)
        return response.status(200).json({
            totalSales: new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP'}).format(totalSales),
            transactions: transactionQuery
        })
    }

}