import type { HttpContext } from '@adonisjs/core/http'
import { SignInValidatorSchema } from '../validators/signin.js'
import User from '../../Admin/models/user.js'
import historyService from '../../Reports/services/historyServices.js'

export default class SigninsController {
    
    async index({view}: HttpContext) {
        return view.render('pages/cms/auth/signIn')
    }

    async signin({ request, response, auth }: HttpContext) {
        const { email, password, isRememberMe } = await request.validateUsing(SignInValidatorSchema)

        const user = await User.verifyCredentials(email, password)

        await auth.use('web').login(user, isRememberMe)

        const group = await user.related('groups').query()

        await historyService(auth.user?.firstname!, `Login User`)

        return response.status(200).json({success: true, message: `Welcome ${user.email}`, data: group})
    }

    async signout({ response, auth }: HttpContext) {
        await auth.use('web').logout()

         await historyService(auth.user?.firstname!, `Logout User`)

        return response.redirect().back()
    }
    
}