import type { HttpContext } from '@adonisjs/core/http'
import Page from '../../CMS/Websites/models/page.js'
import Category from '../../CMS/Websites/models/category.js'

export default class PagesController {
  async index({ view }: HttpContext) {
    const page = await Page.findByOrFail('slug', 'home')
    const customPages = await Page.query().select('slug')

    return view.render('pages/online/landing', { page, customPages })
  }
  async slugPage({ view, params }: HttpContext) {
    const page = await Page.findByOrFail('slug', params.slug)
    return view.render('pages/online/slug', { page })
  }
  async getCustomPages({ response }: HttpContext) {
    const customPages = await Page.query().select('slug')
    return response.status(200).json({ pages: customPages })
  }
  async getCategories({ response }: HttpContext) {
    const categories = await Category.query().select('*').where('status', 'active')
    return response.status(200).json({ categories })
  }
}
