import type { HttpContext } from '@adonisjs/core/http'
import Product from '../../CMS/Websites/models/product.js'

export default class InventoriesController {

    async index({ view, request }: HttpContext) {
        const page = request.input('page', 1)
        const records = await Product.query().preload('productVariants').select('*').where('status','publish').paginate(page, 10)

        const baseUrl = request.url().split('?',1)[0]
        records?.baseUrl(baseUrl)
        
        return view.render('pages/cashiers/inventory', { records: records?.serialize(), paginations: records })
    }

}