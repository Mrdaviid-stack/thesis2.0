import type { HttpContext } from '@adonisjs/core/http'
import ProductVariant from '../models/product_variant.js'

export default class RestockingsController {
    async index({ view, request }: HttpContext) {
        const page = request.input('page', 1)
        const records = await ProductVariant.query().preload('product').select('*').paginate(page, 10)

        const baseUrl = request.url().split('?',1)[0]
        records?.baseUrl(baseUrl)

        return view.render('pages/cms/websites/restocking/restocking_index', { records: records?.serialize(), paginations: records })
    }
    async form({ view, params }: HttpContext) {
        console.log(params)

        const query = await ProductVariant.findByOrFail('id', params.id);

        console.log(query)

        return view.render('pages/cms/websites/restocking/restocking_form', {
            record: {
                id: query.id,
                stock: query.stock
            }
        })
    }
    async store({ request, response }: HttpContext) {
        let { id, stock } = request.body()
        const query = await ProductVariant.findByOrFail('id', id);
        await query.merge({ stock: stock }).save()
        return response.status(200).json({ message: 'Restock Saved!' })
    }
}