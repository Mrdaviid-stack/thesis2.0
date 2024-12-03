import router from "@adonisjs/core/services/router";
import WalkInOrdersController from "../controllers/walk_in_orders_controller.js";
import { middleware } from "#start/kernel";
import AcknowledgementsController from "../controllers/acknowledgements_controller.js";
import OrderTrackingsController from "../controllers/order_trackings_controller.js";
import InventoriesController from "../controllers/inventories_controller.js";

export default function CashierRoutes() {

    router.group(() => {

        router.get('/', [WalkInOrdersController, 'index']).as('walk-in-orders').use(middleware.auth())
        router.post('/order', [WalkInOrdersController, 'order']).as('walk-in-orders.order').use(middleware.auth())

        router.get('/acknowledgements', [AcknowledgementsController, 'index']).as('acknowledgements').use(middleware.auth())
        router.post('/acknowledgements/:transactionId', [AcknowledgementsController, 'acknowledge']).as('acknowledgements.acknowledge').use(middleware.auth())

        router.get('/order-tracking', [OrderTrackingsController, 'index']).as('order-tracking').use(middleware.auth())
        router.post('/order-tracking/:id', [OrderTrackingsController, 'updateDeliveryStatus']).as('order-tracking.update').use(middleware.auth())

        router.get('/inventory', [InventoriesController, 'index']).as('inventory').use(middleware.auth())

    }).prefix('/cashiers')
    
}