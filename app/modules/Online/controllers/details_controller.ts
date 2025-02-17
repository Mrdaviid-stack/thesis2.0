import type { HttpContext } from '@adonisjs/core/http'
import { UpdateAccountValidationSchema } from '../validators/auth.js'
import User from '../../CMS/Admin/models/user.js'

export default class DetailsController {

    async index({ view, response, auth }: HttpContext) {
        if (!await auth.check()) {
            return response.redirect('/login')
        }
        return view.render('pages/online/accounts/details', { user: auth.user})
    }

    async update({ request, response, auth }: HttpContext) {
        if (!await auth.check()) {
            return response.redirect('/login')
        }

        const data = await request.validateUsing(UpdateAccountValidationSchema)
        const user = await User.findOrFail(auth.user?.id)

        if (data.password) {
            user.firstname = data.firstname;
            user.lastname = data.lastname;
            user.email = data.email;
            user.number = data.number;
            user.address = data.address;
            user.password = data.password;
            user.save()
        } else {
            user.firstname = data.firstname;
            user.lastname = data.lastname;
            user.email = data.email;
            user.number = data.number;
            user.address = data.address;
            user.save()
        }

        return response.status(201).send({message: 'Account updated successfully'})
    }


}