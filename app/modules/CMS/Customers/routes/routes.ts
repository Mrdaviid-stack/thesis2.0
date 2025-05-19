import { middleware } from "#start/kernel";
import router from "@adonisjs/core/services/router";
import DetailsController from "../controllers/details_controller.js";
import HistoriesController from "../controllers/histories_controller.js";

export default function CustomerRoutes() {
    router.group(() => {
        
        router.group(() => {
            router.get('/', [DetailsController, 'index'])
        }).prefix('details')

        router.group(() => {
            router.get('/', [HistoriesController, 'index'])
            router.get('/generate', [HistoriesController, 'generate'])
        }).prefix('history')

    }).prefix("/customers").use(middleware.auth());
}