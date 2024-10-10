import router from "@adonisjs/core/services/router";
import PagesController from "../controllers/pages_controller.js";
import { middleware } from "#start/kernel";

export default function WebsiteRoutes() {
    router.group(() => {
        
        router.group(() => {
            router.get('/', [PagesController, 'index']).as('pages.index')
            router.get('/add/:id?', [PagesController, 'form']).as('pages.form')
            router.post('/add', [PagesController, 'store']).as('pages.store')
            // router.delete('/delete/:id?', [GroupsController, 'delete']).as('groups.delete')
        }).prefix("pages")

    }).prefix("/websites").use(middleware.auth());
}