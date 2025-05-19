import type { HttpContext } from '@adonisjs/core/http'
import { LucidModel } from '@adonisjs/lucid/types/model'
import { VineValidator } from '@vinejs/vine'
import historyService from '../../CMS/Reports/services/historyServices.js'

type TBasesController = {
  model: LucidModel
  validationSchema: VineValidator<any, Record<string, any>>
  path: string
  files?: string[]
}

export default class BasesController {
  model
  path
  validationSchema
  files
  constructor({ model, path, validationSchema, files }: TBasesController) {
    if (model) this.model = model

    if (path) this.path = path

    if (validationSchema) this.validationSchema = validationSchema

    if (files) this.files = files
  }

  async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const records = await this.model?.query().select('*').paginate(page, 10)

    const baseUrl = request.url().split('?', 1)[0]
    records?.baseUrl(baseUrl)

    //await historyService(auth.user?.firstname!, `Visit ${this.path?.split('/')[4]} Page`)

    return view.render(this.path + '_index', {
      records: records?.serialize(),
      paginations: records,
    })
  }

  async form({ view, params, auth }: HttpContext) {
    if (params.id) {
      await historyService(auth.user?.firstname!, `View ${this.path?.split('/')[4]} Page`)
      const record = await this.model?.findOrFail(params.id)
      return view.render(this.path + '_form', { record })
    }
    await historyService(auth.user?.firstname!, `View ${this.path?.split('/')[4]} Page`)
    return view.render(this.path + '_form')
  }

  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(this.validationSchema!)
    console.log(data)

    // if params id present update record
    if (data.id) {
      await historyService(auth.user?.firstname!, `Edit ${this.path?.split('/')[4]} Page`)
      const record = await this.model?.findOrFail(data.id)
      delete data.id
      await record?.merge(data).save()
      return response.status(200).json({ message: 'Updated Successfully!', data: record })
    }

    delete data.id

    // save new record
    await historyService(auth.user?.firstname!, `Add ${this.path?.split('/')[4]} Page`)
    const newRecord = await this.model?.create(data)
    return response.status(200).json({ message: 'Added Successfully!', data: newRecord })
  }

  async delete({ request, response, params, auth }: HttpContext) {
    const recordsId = request.body()
    if (params.id) {
      const record = await this.model?.findOrFail(params.id)
      await record?.delete()
      return response.status(200).json({ message: 'Deleted Successfully!' })
    }
    await Promise.all(
      recordsId.map(async (ids: number) => await this.model?.query().where('id', ids).delete())
    )
    await historyService(auth.user?.firstname!, `Delete ${this.path?.split('/')[4]} Page`)
    return response.status(200).json({ message: 'Deleted Successfully!' })
  }
}
