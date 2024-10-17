import type { HttpContext } from '@adonisjs/core/http'
import Page from '../../CMS/Websites/models/page.js'

export default class PagesController {

    async index({ view }: HttpContext) {
        const page = await Page.findByOrFail('slug', 'home')
        return view.render('pages/online/landing', { page })
    }

}