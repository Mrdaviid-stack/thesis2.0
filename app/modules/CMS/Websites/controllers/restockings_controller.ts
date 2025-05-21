import type { HttpContext } from '@adonisjs/core/http'
import ProductVariant from '../models/product_variant.js'
import historyService from '../../Reports/services/historyServices.js'
import Product from '../models/product.js'

export default class RestockingsController {
  async index({ view, request, auth }: HttpContext) {
    const page = request.input('page', 1)
    const records = await ProductVariant.query().preload('product').select('*').paginate(page, 10)

    const baseUrl = request.url().split('?', 1)[0]
    records?.baseUrl(baseUrl)

    await historyService(auth.user?.firstname!, 'Visit Restocking Page')

    return view.render('pages/cms/websites/restocking/restocking_index', {
      records: records?.serialize(),
      paginations: records,
    })
  }
  async form({ view, params }: HttpContext) {
    console.log(params)

    const query = await ProductVariant.findByOrFail('id', params.id)

    console.log(query)

    return view.render('pages/cms/websites/restocking/restocking_form', {
      record: {
        id: query.id,
        stock: query.stock,
      },
    })
  }
  async store({ request, response }: HttpContext) {
    console.log(request.body())
    let { id, stock, batch } = request.body()
    const query = await ProductVariant.findByOrFail('id', id)
    const newStock = Number(query.stock) + Number(stock)

    const product = await Product.findByOrFail('id', query.productId)
    const newbatch = Number(product.batch) + Number(batch)

    await query.merge({ stock: newStock.toString() }).save()
    await product.merge({ batch: newbatch }).save()
    return response.status(200).json({ message: 'Restock Saved!' })
  }
}
