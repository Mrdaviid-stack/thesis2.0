import type { HttpContext } from '@adonisjs/core/http'
import Order from '../../CMS/Websites/models/order.js'
import Transaction from '../../CMS/Websites/models/transaction.js'
import User from '../../CMS/Admin/models/user.js'
import historyService from '../../CMS/Reports/services/historyServices.js'

export default class OrderTrackingsController {
  async index({ view, auth }: HttpContext) {
    const ordersQuery = await Order.query()
      .preload('orderItems', (orderItem) =>
        orderItem.preload('productVariant', (productVariant) => productVariant.preload('product'))
      )
      .preload('transaction', (transaction) => transaction.where('orderType', 'online'))
      .preload('user')
      .orderBy('created_at', 'desc')

    const orders = ordersQuery.flatMap((orders) => {
      return orders.orderItems.map((orderItem) => ({
        orderTransactionId: orders.transaction?.id,
        orderDeliveryStatus: orders.transaction?.deliveryStatus,
        orderInvoice: orders.transaction?.invoice,
        orderPaymentReference: orders.transaction?.reference,
        orderDownpayment: this.CurrencyFormatter(orders.transaction?.downpayment),
        orderTotalAmount: this.CurrencyFormatter(Number(orders.transaction?.totalAmount)),
        orderBalance: this.CurrencyFormatter(
          Number(orders.transaction?.totalAmount) - Number(orders.transaction?.downpayment)
        ),
        orderProductName: orderItem.productVariant?.product.name,
        orderProductSKU: orderItem.productVariant?.sku,
        orderProductColor: orderItem.productVariant?.color,
        orderProductStorage: orderItem.productVariant?.storage,
        orderProductImage: orderItem.productVariant?.image,
        customerName: `${orders.firstName} ${orders.lastName}`,
        customerAddress: orders.address,
        customerPhoneNumber: orders.phone,
      }))
    })

    const userQuery = await User.query().where('id', auth.user?.id!).preload('groups')

    const ridersQuery = await User.query().preload('groups')

    return view.render('pages/cashiers/order-tracking', {
      orders: orders.filter((order) => order.orderDeliveryStatus != 'pending'),
      userType: await userQuery[0].groups[0].name,
      riders: ridersQuery,
    })
  }

  async updateDeliveryStatus({ request, response, params, auth }: HttpContext) {
    const data = request.body()
    console.log(data)
    const transaction = await Transaction.findOrFail(params.id)

    transaction.deliveryStatus = data.deliveryStatus

    transaction.save()

    //await transaction.merge({ deliveryStatus: data.deliveryStatus }).save()
    await historyService(auth.user?.firstname!, `Update Delivery Status`)
    return response.status(200).json({ message: 'Delivery status updated successfully!' })
  }

  async updateRider({ request, response, params, auth }: HttpContext) {
    const data = request.body()

    const transaction = await Transaction.findOrFail(params.id)

    const userQuery = await User.query().where('id', data.riderId)

    const fullname = userQuery[0].firstname + ', ' + userQuery[0].lastname

    transaction.riderName = fullname

    transaction.save()

    //await transaction.merge({ deliveryStatus: data.deliveryStatus }).save()
    await historyService(auth.user?.firstname!, `Update assign rider`)
    return response.status(200).json({ message: 'Delivery status updated successfully!' })
  }

  private CurrencyFormatter(number: number) {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(number)
  }
}
