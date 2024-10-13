import type { HttpContext } from '@adonisjs/core/http'

import Product from "../models/product.js";
import Category from '../models/category.js';
import Subcategory from '../models/subcategory.js';
import { ProductValidationSchema } from '../validators/product.js';
import ProductVariant from '../models/product_variant.js';

export default class ProductsController {

    async index({ view, request }: HttpContext) {
        const page = request.input('page', 1)
        const records = await Product.query().preload('productVariants').select('*').paginate(page, 10)

        const baseUrl = request.url().split('?',1)[0]
        records?.baseUrl(baseUrl)
        
        return view.render('pages/cms/websites/products/products_index', { records: records?.serialize(), paginations: records })
    }

    async form({ view, params }: HttpContext) {
        const categories = await Category.query().select('*').where('status', 'active')
        const subcategories = await Subcategory.query().select('*').where('status', 'active')

        const options = {
            categories: categories.map((category) => ({value: category.id, label: category.name})),
            subcategories: subcategories.map((subcategory) => ({parentCategoryId: subcategory.categoryId ,value: subcategory.id, label: subcategory.name}))
        }

        if (params.id) {
            //const record = await Product.findOrFail(params.id)

            const preload = await Product.query().where('id',params.id).preload('productVariants')

            const test = preload.map((product) => ({
                id: product.id,
                name: product.name,
                modelNumber: product.modelNumber,
                categoryId: product.categoryId,
                subcategoryId: product.subcategoryId,
                content: product.content,
                status: product.status,
                productVariants: product.productVariants.map((variant) => ({
                    id: variant.id,
                    feature: variant.feature,
                    storage: variant.storage,
                    color: variant.color,
                    stock: variant.stock,
                    image: variant.image,
                    sku: variant.sku,
                    price: variant.price,
                }))
            }))
        

            return view.render('pages/cms/websites/products/products_form', { 
                record: test[0],
                options
            })
        }
        return view.render('pages/cms/websites/products/products_form', {
            options
        })
    }

    async store({ request,response }: HttpContext) {
        const data = await request.validateUsing(ProductValidationSchema)

        const product = await Product.updateOrCreate(
            {modelNumber:data.modelNumber},
            {
                categoryId: data.categoryId,
                subcategoryId: data.subcategoryId,
                name: data.name,
                content: data.content,
                status: data.status,
                modelNumber: data.modelNumber,
            }
        )
        const variants: any = data.variants.map((variant) => ({
            productId: product.id,
            feature: variant.feature,
            storage: variant.storage,
            color: variant.color,
            stock: variant.stock,
            image: variant.image,
            sku: variant.sku,
            price: variant.price,
        }))

        await ProductVariant.updateOrCreateMany('sku', variants)
        
        return response.status(200).json({ message: 'Product Saved!' })

    }

    async deleteVariant({ response, params }: HttpContext) {
        await ProductVariant.query().where('id', params.id).delete();
        return response.status(200).json({ message: 'Variant Deleted Successfully!' });
    }

    async delete({ request, response, params }: HttpContext) {
        const recordsId = request.body()
        if (params.id) {
            const record = await Product.findOrFail(params.id)
            await record?.delete()
            return response.status(200).json({ message: 'Deleted Successfully!' })
        }
        await Promise.all(recordsId.map(async (ids: number) => 
            await Product.query().where('id', ids).delete() 
        ))
        return response.status(200).json({ message: 'Deleted Successfully!' })
    }
}

// {
//     categoryId: 1,
//     subcategoryId: 1,
//     name: 'Samsung Galaxy S22',
//     content: '<p>sadsadasd</p>',
//     status: 'draft',
//     variants: [
//       {
//         id: null,
//         color: 'asdasd',
//         storage: 'asd',
//         stock: '2',
//         feature: '<p>sdasd</p>',
//         image: '/uploads/2024/9/13/vnn31og92q0dy8tnmx85nzwa.jpg'
//       },
//       {
//         id: null,
//         color: 'asd',
//         storage: 'asd',
//         stock: '2',
//         feature: '<p>asdasd</p>',
//         image: '/uploads/2024/9/13/awzhnyvowlh1m88z6juuivk5.jpg'
//       }
//     ]
//   }