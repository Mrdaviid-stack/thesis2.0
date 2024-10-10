// import type { HttpContext } from '@adonisjs/core/http'

import BasesController from "../../../Core/controllers/bases_controller.js";
import Page from "../models/page.js";
import { PageValidationSchema } from "../validators/page.js";

export default class PagesController extends BasesController {
    constructor() {
        super({
            model: Page,
            path: 'pages/cms/websites/pages/pages',
            validationSchema: PageValidationSchema,
            files: ['files']
        });
    }
}