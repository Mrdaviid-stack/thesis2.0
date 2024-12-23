import type { HttpContext } from '@adonisjs/core/http'
import Order from '../../Websites/models/order.js';

export default class TransactionsController {

    async index({ view }: HttpContext) {

        return view.render('pages/cms/reports/inventory/transaction_index');

    }

        async generate({ request, response }: HttpContext) {
    
            let { start, end } = request.qs();
    
            const query = await Order.query()
                .preload('orderItems', (orderItems) => 
                    orderItems.preload('productVariant', (productVariantQuery) => 
                        productVariantQuery.preload('product')
                    )
                )
                .preload('transaction', (transactionQuery) => 
                    transactionQuery.whereBetween('created_at', [`${start} 00:00:00.000`, `${end} 23:59:59.000`])
                );
    
            const transaction = query.map(query => ({
                fullname: `${query.firstName}, ${query.lastName}`,
                invoice: query.transaction.invoice,
                reference: query.transaction.reference,
                status: query.transaction.deliveryStatus,
                amount: query.transaction.totalAmount,
                product: query.orderItems.map(item => item.productVariant.product.name)
            }))
    
            return response.status(200).json(transaction)
        }

}