import Alpine from "alpinejs";
import ImageZoom from "js-image-zoom";
import useForm from "../useForms"
document.addEventListener("alpine:init", () => {
    Alpine.data("orderTracking", (props) => ({
        orders: props.orders || [],
        searchQuery: '',
        changeDeliveryStatus(event, orderTransactionId) {
            console.log(orderTransactionId)
            useForm(`/cashiers/order-tracking/${orderTransactionId}`, {deliveryStatus:event.target.value}, {}, )
        }
    }))
})