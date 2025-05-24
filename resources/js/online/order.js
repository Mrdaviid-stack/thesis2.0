import Alpine from "alpinejs";
import axios from "axios";
import ImageZoom from "js-image-zoom";
import useForm from "../useForms"

document.addEventListener("alpine:init", () => {
    Alpine.data("myOrder", (props) => ({
        orders: props.orders || [],

        init() {
            this.orders = this.orders.filter(or => or.status !== 'reject').map(order => ({
                ...order,
                deliveryStatus: (order.deliveryStatus == 'to_ship' || order.deliveryStatus == 'to_receive') ? 'Out for delivery' : order.deliveryStatus
            }));
            console.log(this.orders)
        },

        onCancelOrder(id) {
            console.log('cancel')
            axios.patch(`/my-account/orders/${id}/cancel-request`)
                .then(() => {
                    location.reload()
                })
                .catch(error => console.log(error))
        }
    }))
})