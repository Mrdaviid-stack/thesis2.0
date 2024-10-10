// import type { HttpContext } from '@adonisjs/core/http'

import BasesController from "../../../Core/controllers/bases_controller.js"
import User from "../models/user.js"
import { UserValidationSchema } from "../validators/user.js"

export default class UsersController extends BasesController {
    constructor() {
        super({
            model: User,
            path: 'pages/cms/admin/users/users',
            validationSchema: UserValidationSchema,
        })
    }
}