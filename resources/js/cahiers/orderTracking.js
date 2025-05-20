import Alpine from "alpinejs";
import ImageZoom from "js-image-zoom";
import useForm from "../useForms"
document.addEventListener("alpine:init", () => {
    Alpine.data("orderTracking", (props) => ({
        orders: props.orders || [],
        riders: props.riders || [],
        searchQuery: '',
        isDisabled: false,
        init() {
            this.riders = this.riders.filter(rider =>
                rider.groups.some(group => group.name === 'Riders')
            );

            console.log(this.orders)
        },
        changeDeliveryStatus(event, orderTransactionId) {
            console.log(event.target.value)
            
            useForm(`/cashiers/order-tracking/${orderTransactionId}`, {deliveryStatus:event.target.value}, {}, )
        },
        changeRider(event, orderTransactionId) {
            console.log(event.currentTarget.value)
            useForm(`/cashiers/order-tracking/rider/${orderTransactionId}`, {riderId:event.target.value}, {}, )
        },
        filterStatus(status = 'in_transit') {
            this.orders = props.orders.filter(order => order.orderDeliveryStatus === status)
        }
    }))
})