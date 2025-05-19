import type { HttpContext } from '@adonisjs/core/http'
import Product from '../../CMS/Websites/models/product.js'

export default class InventoriesController {

    async index({ view, request, response, auth }: HttpContext) {

        const guard = await auth.user?.related('groups').query()
        if (guard![0].name === 'Riders') {
            return response.redirect().toPath('/cashiers/order-tracking')
        }

        const page = request.input('page', 1)
        const records = await Product.query().preload('productVariants').select('*').where('status','publish').paginate(page, 10)

        const baseUrl = request.url().split('?',1)[0]
        records?.baseUrl(baseUrl)
        
        return view.render('pages/cashiers/inventory', { records: records?.serialize(), paginations: records })
    }

}