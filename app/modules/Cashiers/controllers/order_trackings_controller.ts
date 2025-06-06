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
        orderTransactionService: orders.transaction?.orderType,
        orderRiderName: orders.transaction?.riderName,
        paidStatus: orders.transaction?.paidStatus,
        receipt: orders.transaction?.receipt,
        fullpaymentReceipt: orders.transaction?.fullpaymentReceipt,
        orderPaymentMethod: orders.transaction?.paymentMethod,
        transactionStatus: orders.transaction?.status
      }))
    })

    const userQuery = await User.query().where('id', auth.user?.id!).preload('groups')

    const ridersQuery = await User.query().preload('groups')

    let newOrders;

    if (userQuery[0].groups[0].name === 'Riders') {
      const riderName = `${auth.user?.firstname}, ${auth.user?.lastname}`
      newOrders = orders.filter((order) => order.orderDeliveryStatus != 'pending' && order.orderTransactionService === 'online' && order.orderRiderName === riderName)
    } else {
      newOrders = orders.filter((order) => order.orderDeliveryStatus != 'pending' && order.orderTransactionService === 'online')
    }

    return view.render('pages/cashiers/order-tracking', {
      orders: newOrders,
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
    transaction.deliveryStatus = 'to_ship'

    transaction.save()

    //await transaction.merge({ deliveryStatus: data.deliveryStatus }).save()
    await historyService(auth.user?.firstname!, `Update assign rider`)
    return response.status(200).json({ message: 'Delivery status updated successfully!' })
  }

  async receipt({ request, response, params }: HttpContext) {
    const data = request.body()
    console.log(data)
    const transaction = await Transaction.findOrFail(params.id)

    transaction.fullpaymentReceipt = data.receipt
    transaction.paidStatus = 'fullypaid'

    transaction.save()

    return response.status(200).json({ message: 'Receipt uploaded successfully!' })
  }

  private CurrencyFormatter(number: number) {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(number)
  }
}
