import Alpine from "alpinejs";
import axios from "axios";
document.addEventListener("alpine:init", () => {
    Alpine.data("navbar", (props) => ({
        customCategories: [],

        init() {
            this.fetchCategories()
            //this.customCategories = JSON.parse(localStorage.getItem('custom_categories'))
            console.log(this.customCategories)
        },

        async fetchCategories() {
            axios.get('/custom/categories')
                .then((response) => {
                    this.customCategories = response.data.categories
                    //localStorage.setItem('custom_categories', JSON.stringify(response.data.categories))
                    //this.carts.push(...response.data.cartItems);
                })
        }

    }))
})