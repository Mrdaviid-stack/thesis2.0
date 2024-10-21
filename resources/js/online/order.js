import Alpine from "alpinejs";
import ImageZoom from "js-image-zoom";
import useForm from "../useForms"
document.addEventListener("alpine:init", () => {
    Alpine.data("myOrder", (props) => ({
        orders: props.orders || [],

        init() {
            console.log(this.orders)
        }
    }))
})