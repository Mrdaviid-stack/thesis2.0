import type { HttpContext } from '@adonisjs/core/http'
import Category from '../../CMS/Websites/models/category.js'
import Product from '../../CMS/Websites/models/product.js'
import Brand from '../../CMS/Websites/models/brand.js'

export default class ProductsController {

    async ProductCategory({ request, view, params }: HttpContext) {
        const page = request.input('page', 1)
        const brands = await Brand.query().select('name','slug').where('status', 'active')
        const category = await Category.findByOrFail('slug', params.category)
        const products = await Product.query()
            .where('categoryId',  category.id)
            .andWhere('status', 'publish')
            .select('id', 'name', 'slug', 'sale')
            .preload('productVariants', (productVariant) => 
                productVariant.select('price','image')
            )
            .paginate(page, 10)

        const baseUrl = request.url().split('?',1)[0]
        products?.baseUrl(baseUrl)

        return view.render('pages/online/product-category', {
            products,
            category: category.name,
            param: params.category,
            brands
        })
    }

}