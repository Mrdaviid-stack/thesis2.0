import router from "@adonisjs/core/services/router";
import SalesController from "../controllers/sales_controller.js";
import { middleware } from "#start/kernel";
export default function ReportRoutes() {

    router.group(() => {

        router.group(() => {
            router.get('/', [SalesController, 'index']).as('sales-reports.index')

            router.get('/generate', [SalesController, 'generate']).as('sales-reports.generate')
        }).prefix("sales")

    }).prefix('reports').use(middleware.auth());

}