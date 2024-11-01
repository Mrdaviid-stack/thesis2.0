import type { HttpContext } from '@adonisjs/core/http'
import User from '../../CMS/Admin/models/user.js'
import _ from 'lodash'
import Transaction from '../../CMS/Websites/models/transaction.js'
import db from '@adonisjs/lucid/services/db'

export default class HomeController {
    async index({ view }: HttpContext) {

        const currentYear = new Date().getFullYear();
        ///const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11

        const usersQuery = await User.query().select('id').preload('groups')
        const transactionQuery = await Transaction.query()
            .select(
                db.raw('EXTRACT(MONTH FROM created_at) as month'),
                db.raw('SUM(total_amount) as total_sales')
            )
            .whereRaw(`EXTRACT(YEAR FROM created_at) = ?`, [currentYear])
            .groupBy('month')
            .orderBy('month');

        // Create an array with 12 months initialized to 0
        const monthlySales = Array(12).fill(0);

        // Map the results to the corresponding month
        transactionQuery.forEach(sale => {
        const month = Math.floor(sale.$extras.month) - 1; // Convert 1-12 to 0-11
        monthlySales[month] = parseFloat(sale.$extras.total_sales);
        });

        const users = usersQuery.map((user) => ({
            groupName: user.groups.map((group) => group.name)[0]
        }))

        return view.render('pages/home', {
            users: _.groupBy(users, (user) => user.groupName),
            monthlySales,
        })
    }
}