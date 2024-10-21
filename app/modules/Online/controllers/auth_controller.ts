import type { HttpContext } from '@adonisjs/core/http'
import { loginValidationSchema, registerValidationSchema } from '../validators/auth.js'

import { customAlphabet } from 'nanoid'
import mail from '@adonisjs/mail/services/main'
import User from '../../CMS/Admin/models/user.js'
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)

export default class AuthController {

    async login({ view }: HttpContext) {
        return view.render('pages/online/login')
    }

    async register({ view }: HttpContext) {
        return view.render('pages/online/register')
    }

    async registerUser({ request, response }: HttpContext) {

        const data = await request.validateUsing(registerValidationSchema)

        const password = nanoid()

        const newUser = await User.create({
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            password: password,
        })

        await newUser.related('groups').sync([3])

        await mail.send((message) => {
            message
               .to(newUser.email)
               .from('admin@yourdomain.com')
               .subject(`Passowrd`)
               .htmlView('emails/register-confirmation', {
                    firstname: newUser.firstname,
                    password: password,
                })
        })

        //await auth.use('web').login(newUser)

        return response.redirect('/login')
    }

    async loginUser({ request, response, auth }: HttpContext) {
        const { email, password, isRememberMe } = await request.validateUsing(loginValidationSchema)

        const user = await User.verifyCredentials(email, password)

        await auth.use('web').login(user, isRememberMe)

        return response.status(200).json({success: true, message: `welcome ${user.firstname}`})
    }

    async forgotPassword({ view }: HttpContext) {
        return view.render('pages/online/forgot-password')
    }

    async forgotPasswordUser({ request, response }: HttpContext) {
        const data = request.body()

        const password = nanoid()

        const user = await User.findByOrFail('email', data.email)

        await user.merge({ password: password }).save()

        await mail.send((message) => {
            message
               .to(user.email)
               .from('admin@yourdomain.com')
               .subject(`Forgot Password`)
               .htmlView('emails/register-confirmation', {
                    firstname: user.firstname,
                    password: password,
                })
        })

        return response.status(200).json({success: true})
    }

    async logout({ response, auth }: HttpContext) {
        await auth.use('web').logout()
        return response.redirect('/')
    }

}