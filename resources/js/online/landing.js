import Alpine from "alpinejs";
import axios from "axios";
document.addEventListener("alpine:init", () => {
    Alpine.data("landing", (props) => ({
        customPage: [],

        init() {
            this.fetchCustomPage()
            this.customPage = JSON.parse(localStorage.getItem('custom_page'))
            console.log(this.customPage)
        },

        async fetchCustomPage() {
            axios.get('/custom/pages')
                .then((response) => {

                    localStorage.setItem('custom_page', JSON.stringify(response.data.pages))
                    //this.carts.push(...response.data.cartItems);
                })

        },

    }))
})