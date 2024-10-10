//import type { HttpContext } from '@adonisjs/core/http'

import BasesController from "../../../Core/controllers/bases_controller.js";
import Group from "../models/group.js";
import { GroupValidationSchema } from "../validators/group.js";

export default class GroupsController extends BasesController {
    constructor() {
        super({
            model: Group,
            path: 'pages/cms/admin/groups/groups',
            validationSchema: GroupValidationSchema,
        });
    }
}