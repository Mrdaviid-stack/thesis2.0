import type { HttpContext } from '@adonisjs/core/http'

import User from "../models/user.js"
import { UserValidationSchema } from "../validators/user.js"
import Group from '../models/group.js'
import historyService from '../../Reports/services/historyServices.js'

export default class UsersController {
    // constructor() {
    //     super({
    //         model: User,
    //         path: 'pages/cms/admin/users/users',
    //         validationSchema: UserValidationSchema,
    //     })
    // }

    async index({ view, request }: HttpContext) {

        const page = request.input('page', 1)
        const records = await User.query().select('*').paginate(page, 10)

        const baseUrl = request.url().split('?',1)[0]
        records?.baseUrl(baseUrl)

        return view.render('pages/cms/admin/users/users_index', { records: records?.serialize(), paginations: records })
    }

    async form({ view, params, auth }: HttpContext) {
        const groupQuery = await Group.all()

        const groupOptions = groupQuery.map(group => ({
            value: group.id,
            label: group.name
        }))

        await historyService(auth.user?.firstname!, `View Users Form`)

        if (params.id) {
            const userQuery = await User.query().where('id',params.id).preload('groups')
            const record = userQuery.map(user => ({
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                number: user.number,
                address: user.address,
                group: user.groups.map(grp => grp.id)[0]
            }))[0]
            return view.render('pages/cms/admin/users/users_form', { record, groupOptions })
        }
        return view.render('pages/cms/admin/users/users_form', { groupOptions })
    }

    async store({request, response, auth}: HttpContext) {
        const data = request.body()
        console.log(data)
        if (data.id) {
            const user = await User.find(data.id)
            await user?.merge({
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                number: data.number,
                address: data.address,
            }).save()
            user?.related('groups').sync([data.group])
            await historyService(auth.user?.firstname!, `Update Users`)
            return response.status(200).json({ message: 'Updated Successfully!', data: user })
        }

        const result = await UserValidationSchema.validate(data)
        const user = await User.create({
            firstname: result.firstname,
            lastname: result.lastname,
            email: result.email,
            number: result.number,
            address: result.address,
            password:result.lastname,
        })

        await user.related('groups').sync([result.group!])
        await historyService(auth.user?.firstname!, `Add User`)
        return response.status(200).json({ message: 'Added Successfully!', data: user })
    }
}