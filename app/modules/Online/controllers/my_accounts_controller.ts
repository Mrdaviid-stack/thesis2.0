import type { HttpContext } from '@adonisjs/core/http'

export default class MyAccountsController {

    async index({ view, response, auth }: HttpContext) {
        if (!await auth.check()) {
            return response.redirect('/login')
        }
        return view.render('pages/online/accounts/my-account')
    }

}