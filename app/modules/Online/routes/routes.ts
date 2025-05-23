import router from '@adonisjs/core/services/router'
import PagesController from '../controllers/pages_controller.js'
import ProductsController from '../controllers/products_controller.js'
import ShopsController from '../controllers/shops_controller.js'
import CartsController from '../controllers/carts_controller.js'
import CheckoutsController from '../controllers/checkouts_controller.js'
import AuthController from '../controllers/auth_controller.js'
import MyAccountsController from '../controllers/my_accounts_controller.js'
import OrdersController from '../controllers/orders_controller.js'
import DetailsController from '../controllers/details_controller.js'
import { middleware } from '#start/kernel'

export default function OnlineRoutes() {
  router.group(() => {
    router.get('/', [PagesController, 'index']).as('landing')

    router.get('/bsd/:slug', [PagesController, 'slugPage'])
    router.get('/custom/pages', [PagesController, 'getCustomPages'])

    router.get('/login', [AuthController, 'login']).as('login')
    router.get('/register', [AuthController, 'register']).as('register')
    router.get('/forgot-password', [AuthController, 'forgotPassword']).as('forgotPassword')

    router.post('/login', [AuthController, 'loginUser']).as('loginUser')
    router.post('/register', [AuthController, 'registerUser']).as('registerUser')
    router.post('/forgot-password', [AuthController, 'forgotPasswordUser']).as('forgotPasswordUser')

    router.get('/logout', [AuthController, 'logout']).as('logout')

    router
      .get('/product-category/:category', [ProductsController, 'ProductCategory'])
      .as('product-category')

    router.get('/shop/:categorySlug/:productSlug', [ShopsController, 'shop']).as('shop')

    router.get('/cart', [CartsController, 'index']).as('cart').use(middleware.auth())
    router
      .get('/cart/items', [CartsController, 'getCartItems'])
      .as('userCart')
      .use(middleware.auth())
    router.post('/cart/add', [CartsController, 'addToCart']).as('addToCart').use(middleware.auth())
    router
      .put('/cart/:id/update', [CartsController, 'updateQuantityInCart'])
      .as('updateQuantityInCart')
      .use(middleware.auth())
    router
      .delete('/cart/:id/remove', [CartsController, 'removeItemInCart'])
      .as('cart.items.remove')
      .use(middleware.auth())

    router
      .get('/checkout', [CheckoutsController, 'index'])
      .as('checkoutIndex')
      .use(middleware.auth())
    router
      .post('/checkout', [CheckoutsController, 'checkout'])
      .as('checkoutPost')
      .use(middleware.auth())

    router
      .get('/my-account', [MyAccountsController, 'index'])
      .as('myAccount')
      .use(middleware.auth())

    router
      .get('/my-account/orders', [OrdersController, 'index'])
      .as('orders')
      .use(middleware.auth())
    router
      .patch('/my-account/orders/:id/cancel-request', [OrdersController, 'cancelOrder'])
      .as('order-cancel-request')
      .use(middleware.auth())
    router
      .patch('/my-account/orders/:id/cancel-confirm', [OrdersController, 'cancledConfirm'])
      .as('order-cancel-confirm')
      .use(middleware.auth())

    router
      .get('/my-account/details', [DetailsController, 'index'])
      .as('details')
      .use(middleware.auth())

    router
      .post('/my-account/details', [DetailsController, 'update'])
      .as('details.update')
      .use(middleware.auth())
  })
}
