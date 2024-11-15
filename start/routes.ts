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
import OnlineRoutes from '../app/modules/Online/routes/routes.js'
import CashierRoutes from '../app/modules/Cashiers/routes/routes.js'
import ReportRoutes from '../app/modules/CMS/Reports/routes/routes.js'
import CustomerRoutes from '../app/modules/CMS/Customers/routes/routes.js'

OnlineRoutes()
CashierRoutes()
AuthRoutes()

router.group(() => {
    router.get('/', [HomeController, 'index']).as('dashboard').use(middleware.auth())
    AdminRoutes()
    WebsiteRoutes()
    FileRoutes()
    ReportRoutes()
    CustomerRoutes()
}).prefix('cms')
