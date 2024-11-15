import type { HttpContext } from '@adonisjs/core/http'
import User from '../../Admin/models/user.js'
import db from '@adonisjs/lucid/services/db'

export default class DetailsController {

    async index({ view, request }: HttpContext) {

        const page = request.input('page', 1)

        const customers = await User.query().select('id','email','address',
            db.raw('CONCAT(firstname, \' \', lastname) AS fullname')
        ).whereHas('groups', (groupQuery) => groupQuery.where('name', 'Customers')).paginate(page, 10)

        const baseUrl = request.url().split('?',1)[0]
        customers?.baseUrl(baseUrl)

        return view.render('pages/cms/customers/details/details_index', {customers})
    }

}