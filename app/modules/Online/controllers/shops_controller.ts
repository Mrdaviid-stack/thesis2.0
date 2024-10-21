import type { HttpContext } from '@adonisjs/core/http'
import Product from '../../CMS/Websites/models/product.js'

export default class ShopsController {

    async shop({ view, params }: HttpContext) {
        const product = await Product.query()
            .where('slug', params.productSlug)
            .preload('productVariants', (productVariant) =>  
                productVariant.where('stock', '>', 0)
        ).first()
        return view.render('pages/online/shop', { product: product?.serialize() })
    }
}