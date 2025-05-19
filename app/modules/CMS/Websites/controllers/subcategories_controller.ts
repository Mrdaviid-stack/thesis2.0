import type { HttpContext } from '@adonisjs/core/http'

import Subcategory from "../models/subcategory.js";
import { SubcategoryValidationSchema } from "../validators/subcategory.js";
import Category from '../models/category.js';
import historyService from '../../Reports/services/historyServices.js';

export default class SubcategoriesController {

    async index({ view, request, params, session, auth }: HttpContext) {

        const page = request.input('page', 1)
        const category = await Category.findByOrFail('slug', params.slug)
        const records = await Subcategory.query().where('categoryId', category.id).select('*').paginate(page, 10)

        session.put('slug', params.slug)

        const baseUrl = request.url().split('?',1)[0]
        records?.baseUrl(baseUrl)

        await historyService(auth.user?.firstname!, 'Visit Sub-Categories Page')
        
        return view.render('pages/cms/websites/categories/subcategories_index', { records: records?.serialize(), paginations: records })
    }

    async form({ view, params }: HttpContext) {
        if (params.id) {
            const record = await Subcategory.findOrFail(params.id)
            return view.render('pages/cms/websites/categories/subcategories_form', { record })
        }
        return view.render('pages/cms/websites/categories/subcategories_form')
    }

    async store({ request, response, session }: HttpContext) {
        const data = await request.validateUsing(SubcategoryValidationSchema)
        const slug  = session.get('slug')

        const category = await Category.findByOrFail('slug', slug)
        if (data.id) {
            const record = await Subcategory.findOrFail(data.id)
            await record?.merge({
                name:data.name,
                description: data.description,
                status: data.status,
                categoryId: String(category.id),
            }).save()
            return response.status(200).json({ message: 'Updated Successfully!', data: record })
        }

        // save new record
        const newRecord = await Subcategory.create({
            name: data.name,
            description: data.description,
            status: data.status,
            categoryId: String(category.id),
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