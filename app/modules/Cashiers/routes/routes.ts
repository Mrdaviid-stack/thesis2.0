import router from "@adonisjs/core/services/router";
import WalkInOrdersController from "../controllers/walk_in_orders_controller.js";
import { middleware } from "#start/kernel";

export default function CashierRoutes() {

    router.group(() => {

        router.get('/', [WalkInOrdersController, 'index']).as('walk-in-orders').use(middleware.auth())
        router.post('/order', [WalkInOrdersController, 'order']).as('walk-in-orders.order').use(middleware.auth())

    }).prefix('/cashiers')
    
}