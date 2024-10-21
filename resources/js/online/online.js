import Alpine from "alpinejs";
import axios from "axios";

document.addEventListener("alpine:init", () => {
    if (!Alpine.store('online')) {
    Alpine.store('online', (props) => ({
        carts: [],
        init() {
            axios.get('/shop/user-cart-items')
                .then((response) => {
                    this.carts.push(...response.data.cartItems);
                })
        },
    }))
    }
})