import type { HttpContext } from '@adonisjs/core/http'

export default class HistoriesController {

    async index({ view }: HttpContext) {
        return view.render('pages/cms/customers/history/history_index')
    }

}