import Alpine from "alpinejs";
import axios from "axios";
import cities from '../ph.json'
import useForm from '../useForms'

document.addEventListener("alpine:init", () => {
    Alpine.data('cart', (props) => ({
        carts: [],
        cities: cities,
        total: 0,
        orderDetails: {
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            phone: '',
            email: '',
            notes: '',
            total: '',
            downpayment: '',
            reference: '',
            paymentMethod: '',
            carts: [],
        },
        init() {
            this.$watch('carts', () =>  console.log('watching carts'))
            this.initializeCart()
        },
        initializeCart() {
            axios.get('/cart/items')
                .then((response) => {
                    this.carts.push(...response.data.cartItems);
                })
            this.$watch('carts', () => {
                this.total = `₱${this.carts.reduce((sum, item) => sum + item.price * item.qty, 0).toLocaleString()}`
                this.orderDetails.total = this.carts.reduce((sum, item) => sum + item.price * item.qty, 0)
                this.orderDetails.carts = this.carts
            })
        },
        addQty(id) {

            const cart = this.carts.find(cart => cart.id === id);
            cart.qty++;
            cart.totalAmount = cart.price * cart.qty;
            this.updateItemQuantity(id, cart.qty)
        },
        subtractQty(id) {
            const cart = this.carts.find(cart => cart.id === id);
            cart.qty--;
            cart.totalAmount = cart.price * cart.qty;
            this.updateItemQuantity(id, cart.qty)
        },
        removeItem(id) {
            axios.delete(`/cart/${id}/remove`)
                .then(() => {
                    console.log('removed from cart')
                    this.carts = this.carts.filter(cart => cart.id !== id);
                    location.reload()
                })
        },
        updateItemQuantity(id, qty) {
            console.log(qty)
            axios.put(`/cart/${id}/update`, qty)
                .then(() => console.log('updated quantity'))
        },
        checkout() {
            useForm("/checkout", this.orderDetails, this.errors, '/')
        }
    }))
})