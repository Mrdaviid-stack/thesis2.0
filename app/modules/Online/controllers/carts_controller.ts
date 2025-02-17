import type { HttpContext } from '@adonisjs/core/http'
import CartItem from '../../CMS/Websites/models/cart_item.js'
import Cart from '../../CMS/Websites/models/cart.js'

export default class CartsController {

    async index({ view, response, auth }: HttpContext) {

        if (!await auth.check()) {
            return response.redirect('/login')
        }
        return view.render('pages/online/cart')
    }

    async addToCart({ request, response, auth }: HttpContext) {
        if (!await auth.check()) {
            return response.redirect('/login')
        }
        const { variantId } = request.body()
        // Add product to cart
        const userCart = await Cart.firstOrCreate(
            { userId: auth.user?.id}
        )

        const cartItem = await CartItem.findBy('productVariantId', variantId)
        if (cartItem) {
            cartItem.quantity += 1
            await cartItem.save()
        } else {
            await CartItem.create({
                cartId: userCart.id,
                productVariantId: variantId,
            })
        }

        return response.status(200).json({ message: 'Added to cart successfully!' })
        
    }

    async getCartItems({ response, auth }: HttpContext) {
        if (!await auth.check()) {
            return response.status(409)
        }

        const userCartWithItems = await Cart.query().where('userId', auth.user?.id!).preload('cartItems', (cartItem) => cartItem.preload('productVariant', (productVariant) => productVariant.preload('product')))

        const serializedItems = userCartWithItems.flatMap((items) => 
            items.cartItems.map((item) => ({
                id: item.productVariant.id,
                name: item.productVariant.product.name,
                color: item.productVariant.color,
                storage: item.productVariant.storage,
                price: item.productVariant.price,
                image: item.productVariant.image,
                stock: item.productVariant.stock,
                qty: item.quantity,
                totalAmount: item.productVariant.price,
                sale: item.productVariant.product.sale,
            })))

        return response.status(200).json({ cartItems: serializedItems })
    }

    async updateQuantityInCart({ response, params, request }: HttpContext) {
        const data = request.body()
        const cartItem = await CartItem.find(params.id)
        await cartItem?.merge({quantity: Number(Object.keys(data)[0])}).save()
        return response.status(200).json({ message: 'Quantity updated successfully!' })
    }

    async removeItemInCart({ response, params }: HttpContext) {
        console.log(params.id)
        const cartItem = await CartItem.findBy('product_variant_id', params.id)
        await cartItem?.delete()
        return response.status(201).json({success:true})
    }

}