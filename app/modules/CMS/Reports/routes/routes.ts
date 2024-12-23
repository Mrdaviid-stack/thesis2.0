import router from "@adonisjs/core/services/router";
import SalesController from "../controllers/sales_controller.js";
import { middleware } from "#start/kernel";
import TrackingsController from "../controllers/trackings_controller.js";
import TransactionsController from "../controllers/transactions_controller.js";
export default function ReportRoutes() {

    router.group(() => {

        router.group(() => {
            router.get('/', [SalesController, 'index']).as('sales-reports.index')

            router.get('/generate', [SalesController, 'generate']).as('sales-reports.generate')
        }).prefix("sales")

        router.group(() => {
            router.get('/', [TrackingsController, 'index']).as('traking-reports.index')

            router.get('/generate', [TrackingsController, 'generate']).as('traking-reports.generate')
        }).prefix("tracking")

        router.group(() => {
            router.get('/', [TransactionsController, 'index']).as('transaction-reports.index')

            router.get('/generate', [TransactionsController, 'generate']).as('transaction-reports.generate')
        }).prefix("transaction")

    }).prefix('reports').use(middleware.auth());

}