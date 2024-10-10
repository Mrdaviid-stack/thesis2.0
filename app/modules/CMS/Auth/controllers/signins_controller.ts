import type { HttpContext } from '@adonisjs/core/http'
import { SignInValidatorSchema } from '../validators/signin.js'
import User from '../../Admin/models/user.js'

export default class SigninsController {
    
    async index({view}: HttpContext) {
        return view.render('pages/cms/auth/signIn')
    }

    async signin({ request, response, auth }: HttpContext) {
        const { email, password, isRememberMe } = await request.validateUsing(SignInValidatorSchema)

        const user = await User.verifyCredentials(email, password)

        await auth.use('web').login(user, isRememberMe)

        return response.status(200).json({success: true, message: `Welcome ${user.email}`})
    }

    async signout({ response, auth }: HttpContext) {
        await auth.use('web').logout()

        return response.redirect().back()
    }
    
}