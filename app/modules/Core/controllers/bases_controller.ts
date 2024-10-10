import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { LucidModel } from "@adonisjs/lucid/types/model"
import { VineValidator } from '@vinejs/vine'

type TBasesController = {
    model: LucidModel,
    validationSchema: VineValidator<any, Record<string, any>>
    path: string,
    files?: string[],
}

export default class BasesController {
    model
    path
    validationSchema
    files
    constructor({ model, path, validationSchema, files }: TBasesController) {
        if (model) 
            this.model = model

        if (path)
            this.path = path

        if (validationSchema)
            this.validationSchema = validationSchema 

        if (files) 
            this.files = files
    }

    async index({ view, request }: HttpContext) {
        const page = request.input('page', 1)
        const records = await this.model?.query().select('*').paginate(page, 10)

        const baseUrl = request.url().split('?',1)[0]
        records?.baseUrl(baseUrl)
        
        return view.render(this.path + '_index', { records: records?.serialize(), paginations: records })
    }

    async form({ view, params }: HttpContext) {
        if (params.id) {
            const record = await this.model?.findOrFail(params.id)
            return view.render(this.path + '_form', { record })
        }
        return view.render(this.path + '_form')
    }

    async store({ request, response }: HttpContext) {
        const data = await request.validateUsing(this.validationSchema!)

        // handle file if exists
        if (this.files?.length! > 0) {
            await Promise.all(this.files!.map(async (files) => {
                const file = request.file(files)
                if (file) {
                    const date = new Date()
                    await file.move(app.makePath(`public/uploads/${date.getFullYear()}/${date.getMonth()}/${date.getDate()}/`), {
                        name: `${cuid()}.${file.extname}`
                    })
                    data[files] = file.filePath?.split(`\\`).splice(-5).join(`\\`).replaceAll('\\', '/')
                }
            }))
        }
        // if params id present update record
        if (data.id) {
            const record = await this.model?.findOrFail(data.id)
            delete data.id
            await record?.merge(data).save()
            return response.status(200).json({ message: 'Updated Successfully!', data: record })
        }

        // save new record
        const newRecord = await this.model?.create(data)
        return response.status(200).json({ message: 'Added Successfully!', data: newRecord })

    }

    async delete({ request, response, params }: HttpContext) {
        const recordsId = request.body()
        if (params.id) {
            const record = await this.model?.findOrFail(params.id)
            await record?.delete()
            return response.status(200).json({ message: 'Deleted Successfully!' })
        }
        await Promise.all(recordsId.map(async (ids: number) => 
            await this.model?.query().where('id', ids).delete() 
        ))
        return response.status(200).json({ message: 'Deleted Successfully!' })
    }
}