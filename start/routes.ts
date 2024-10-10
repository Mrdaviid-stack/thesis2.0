/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AdminRoutes from '../app/modules/CMS/Admin/routes/routes.js'
import WebsiteRoutes from '../app/modules/CMS/Websites/routes/routes.js'
import AuthRoutes from '../app/modules/CMS/Auth/routes/routes.js'
import { middleware } from './kernel.js'
import FileRoutes from '../app/modules/CMS/Files/routes/routes.js'
import HomeController from '../app/modules/Core/controllers/home_controller.js'

router.get('/', (response) => response.response.send('Hello World!'))

router.group(() => {
    router.get('/', [HomeController, 'index']).as('dashboard').use(middleware.auth())
    AuthRoutes()
    AdminRoutes()
    WebsiteRoutes()
    FileRoutes()
}).domain('cms-alpine.localhost')
