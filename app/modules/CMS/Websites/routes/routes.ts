import router from "@adonisjs/core/services/router";
import PagesController from "../controllers/pages_controller.js";
import { middleware } from "#start/kernel";
import CategoriesController from "../controllers/categories_controller.js";
import SubcategoriesController from "../controllers/subcategories_controller.js";
import ProductsController from "../controllers/products_controller.js";

export default function WebsiteRoutes() {
    router.group(() => {
        
        router.group(() => {
            router.get('/', [PagesController, 'index']).as('pages.index')
            router.get('/add/:id?', [PagesController, 'form']).as('pages.form')
            router.post('/add', [PagesController, 'store']).as('pages.store')
            router.delete('/delete/:id?', [PagesController, 'delete']).as('pages.delete')
            router.get('/preview/:slug', [PagesController, 'preview']).as('pages.preview')
        }).prefix("pages")

        router.group(() => {
            router.get('/', [CategoriesController, 'index']).as('categories.index')
            router.get('/add/:id?', [CategoriesController, 'form']).as('categories.form')
            router.post('/add', [CategoriesController, 'store']).as('categories.store')
            router.delete('/delete/:id?', [CategoriesController, 'delete']).as('categories.delete')

            router.group(() => {
                router.get('/:slug', [SubcategoriesController, 'index']).as('subcategories.index')
                router.get('/add/form/:id?', [SubcategoriesController, 'form']).as('subcategories.form')
                router.post('/add', [SubcategoriesController, 'store']).as('subcategories.store')
                // router.delete('/delete/:id?', [SubcategoriesController, 'delete']).as('subcategories.delete')
            }).prefix("subcategories")

        }).prefix("categories")


        router.group(() => {
            router.get('/', [ProductsController, 'index']).as('products.index')
            router.get('/add/:id?', [ProductsController, 'form']).as('products.form')
            router.post('/add', [ProductsController, 'store']).as('products.store')
            router.delete('/variant/:id/delete', [ProductsController, 'deleteVariant']).as('products.delete_variant')
            router.delete('/delete/:id?', [ProductsController, 'delete']).as('products.delete')
        }).prefix("products")

    }).prefix("/websites").use(middleware.auth());
}