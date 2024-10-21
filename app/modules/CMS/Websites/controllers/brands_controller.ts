// import type { HttpContext } from '@adonisjs/core/http'

import BasesController from "../../../Core/controllers/bases_controller.js";
import Brand from "../models/brand.js";
import { BrandValidationSchema } from "../validators/brand.js";

export default class BrandsController extends BasesController {
    constructor() {
        super({
            model: Brand,
            path: 'pages/cms/websites/brands/brands',
            validationSchema: BrandValidationSchema
        })
    }
}