import Alpine from "alpinejs";
import axios from "axios";
import cities from '../ph.json'
import useForm from '../useForms'

document.addEventListener("alpine:init", () => {
    Alpine.data('cart', (props) => ({
        carts: [],
        cities: cities.sort((a,b) => a.city.localeCompare(b.city)),
        total: 0,
        discount: 0,
        orderDetails: {
            firstName: props.firstname || '',
            lastName: props.lastname || '',
            address: props.address || '',
            city: '',
            phone: '',
            email: props.email || '',
            notes: '',
            total: '',
            downpayment: '',
            reference: '',
            number: props.number || '',
            paymentMethod: '',
            carts: [],
        },
        isProcessing: false,

        init() {
            this.$watch('carts', () =>  console.log('watching carts'))
            this.initializeCart()
        },
        initializeCart() {
            axios.get('/cart/items')
                .then((response) => {
                    this.carts.push(...response.data.cartItems);
                })
            console.log(this.carts)
            this.$watch('carts', () => {
                this.total = `₱${this.carts.reduce((sum, item) => sum + item.price * item.qty, 0).toLocaleString()}`
                this.discount = `₱${this.carts.reduce((sum, item) => sum + this.disCountedPrice(item.price, item.sale) * item.qty, 0).toLocaleString()}`
                this.discountAmount = this.carts.reduce((sum, item) => sum + item.sale * item.qty, 0)
                this.orderDetails.total = this.carts.reduce((sum, item) => sum + this.disCountedPrice(item.price, item.sale) * item.qty, 0)
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
            this.isProcessing = true;
            useForm("/checkout", this.orderDetails, this.errors, '/')
            
        },
        disCountedPrice(original, discount) {
            const discountAmount = original * discount / 100;
            const discountedPrice = original - discountAmount;
            return discountedPrice
        }
    }))
})