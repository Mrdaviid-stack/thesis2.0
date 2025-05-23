import type { HttpContext } from '@adonisjs/core/http'
import Product from '../../CMS/Websites/models/product.js'
import Order from '../../CMS/Websites/models/order.js'
import ProductVariant from '../../CMS/Websites/models/product_variant.js'
import OrderItem from '../../CMS/Websites/models/order_item.js'
import Transaction from '../../CMS/Websites/models/transaction.js'

import { customAlphabet } from 'nanoid'
import historyService from '../../CMS/Reports/services/historyServices.js'
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)

export default class WalkInOrdersController {

    async index({ view, request, response, auth }: HttpContext) {

        const guard = await auth.user?.related('groups').query()
        if (guard![0].name === 'Riders') {
            return response.redirect().toPath('/cashiers/order-tracking')
        }

        const page = request.input('page', 1)
        const products = await Product.query()
            .select('id', 'name')
            .where('status', 'publish')
            .preload('productVariants', (productVariant) => 
                productVariant.where('stock', '>', 0)
        ).paginate(page, 20)

        const baseUrl = request.url().split('?',1)[0]
        products?.baseUrl(baseUrl)

        return view.render('pages/cashiers/walk-in-orders', { products})
    }

    async order({ request, response, auth }: HttpContext) {
        const data = request.body()
        const order = await Order.create({
            userId: auth.user?.id,
            firstName: auth.user?.firstname,
            lastName: auth.user?.lastname,
            address: auth.user?.address,
            email: auth.user?.email,
        })

        const variant =await ProductVariant.find(data.variantId)
        const totalStock = parseInt(data.stock) - parseInt(data.qty)
        await variant?.merge({ stock: String(totalStock)}).save()

        await OrderItem.create({
            orderId: order.id,
            productVariantId: data.variantId,
            quantity: data.qty,
            price: data.price,
        })

        await Transaction.create({
            orderId: order.id,
            invoice: `INV-${nanoid()}`,
            totalAmount: data.price,
            reference: 'cash',
            downpayment: data.price,
            paymentMethod: data.paymentType,
            deliveryStatus: 'delivered',
            orderType: 'onsite',
        })
        await historyService(auth.user?.firstname!, `Transact Walk-in order`)
        return response.status(200).json({message: 'Transaction created successfully'})
    }

}