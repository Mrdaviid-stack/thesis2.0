import type { HttpContext } from '@adonisjs/core/http'

import Subcategory from "../models/subcategory.js";
import { SubcategoryValidationSchema } from "../validators/subcategory.js";
import Category from '../models/category.js';

export default class SubcategoriesController {

    async index({ view, request }: HttpContext) {
        const page = request.input('page', 1)
        const records = await Subcategory.query().select('*').paginate(page, 10)

        const baseUrl = request.url().split('?',1)[0]
        records?.baseUrl(baseUrl)
        
        return view.render('pages/cms/websites/categories/subcategories_index', { records: records?.serialize(), paginations: records })
    }

    async form({ view, params }: HttpContext) {
        const categories = await Category.query().select('*').where('status', 'active')
        const options = categories.map((category) => ({ value: category.id, label: category.name}))
        if (params.id) {
            const record = await Subcategory.findOrFail(params.id)
            return view.render('pages/cms/websites/categories/subcategories_form', { record, options })
        }
        return view.render('pages/cms/websites/categories/subcategories_form', { options })
    }

    async store({ request, response }: HttpContext) {
        const data = await request.validateUsing(SubcategoryValidationSchema)

        // if params id present update record
        if (data.id) {
            const record = await Subcategory.findOrFail(data.id)
            await record?.merge({
                name:data.name,
                description: data.description,
                status: data.status,
                categoryId: data.categoryId,
            }).save()
            return response.status(200).json({ message: 'Updated Successfully!', data: record })
        }

        // save new record
        const newRecord = await Subcategory.create({
            name: data.name,
            description: data.description,
            status: data.status,
            categoryId: data.categoryId,
        })
        return response.status(200).json({ message: 'Added Successfully!', data: newRecord })

    }

    async delete({ request, response, params }: HttpContext) {
        const recordsId = request.body()
        if (params.id) {
            const record = await Subcategory.findOrFail(params.id)
            await record?.delete()
            return response.status(200).json({ message: 'Deleted Successfully!' })
        }
        await Promise.all(recordsId.map(async (ids: number) => 
            await Subcategory.query().where('id', ids).delete() 
        ))
        return response.status(200).json({ message: 'Deleted Successfully!' })
    }
}