import router from "@adonisjs/core/services/router";
import GroupsController from "../controllers/groups_controller.js";
import UsersController from "../controllers/users_controller.js";
import PermissionsController from "../controllers/permissions_controller.js";
import { middleware } from "#start/kernel";

export default function AdminRoutes() {
    router.group(() => {
        
        router.group(() => {
            router.get('/', [GroupsController, 'index']).as('groups.index')
            router.get('/add/:id?', [GroupsController, 'form']).as('groups.form')
            router.post('/add', [GroupsController, 'store']).as('groups.store')
            router.delete('/delete/:id?', [GroupsController, 'delete']).as('groups.delete')
        }).prefix("groups")

        router.group(() => {
            router.get('/add/:id?', [PermissionsController, 'form']).as('permimssions.form')
            router.post('/add/:id?', [PermissionsController, 'store']).as('permimssions.store')
        }).prefix("permissions")

        router.group(() => {
            router.get('/', [UsersController, 'index']).as('users.index')
            router.get('/add/:id?', [UsersController, 'form']).as('users.form')
            // router.post('/add', [GroupsController, 'store']).as('groups.store')
            // router.delete('/delete/:id?', [GroupsController, 'delete']).as('groups.delete')
        }).prefix("users")

    }).prefix("/admin").use(middleware.auth());
}