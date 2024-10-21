// import type { HttpContext } from '@adonisjs/core/http'
import BasesController from "../../../Core/controllers/bases_controller.js";

import Category from "../models/category.js";
import { CategoryValidationSchema } from "../validators/category.js";

export default class CategoriesController extends BasesController {
    constructor() {
        super({
            model: Category,
            path: 'pages/cms/websites/categories/categories',
            validationSchema: CategoryValidationSchema,
        });
    }
}