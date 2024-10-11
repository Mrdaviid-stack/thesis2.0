import router from "@adonisjs/core/services/router";
import PagesController from "../controllers/pages_controller.js";
import { middleware } from "#start/kernel";
import CategoriesController from "../controllers/categories_controller.js";
import SubcategoriesController from "../controllers/subcategories_controller.js";

export default function WebsiteRoutes() {
    router.group(() => {
        
        router.group(() => {
            router.get('/', [PagesController, 'index']).as('pages.index')
            router.get('/add/:id?', [PagesController, 'form']).as('pages.form')
            router.post('/add', [PagesController, 'store']).as('pages.store')
            // router.delete('/delete/:id?', [GroupsController, 'delete']).as('groups.delete')
        }).prefix("pages")

        router.group(() => {
            router.get('/', [CategoriesController, 'index']).as('categories.index')
            router.get('/add/:id?', [CategoriesController, 'form']).as('categories.form')
            router.post('/add', [CategoriesController, 'store']).as('categories.store')
            router.delete('/delete/:id?', [CategoriesController, 'delete']).as('categories.delete')
        }).prefix("categories")

        router.group(() => {
            router.get('/', [SubcategoriesController, 'index']).as('subcategories.index')
            router.get('/add/:id?', [SubcategoriesController, 'form']).as('subcategories.form')
            router.post('/add', [SubcategoriesController, 'store']).as('subcategories.store')
            router.delete('/delete/:id?', [SubcategoriesController, 'delete']).as('subcategories.delete')
        }).prefix("subcategories")

    }).prefix("/websites").use(middleware.auth());
}