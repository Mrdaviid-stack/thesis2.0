import Alpine from "alpinejs";
import axios from "axios";
import ImageZoom from "js-image-zoom";
import useForm from "../useForms"
import printJS from "print-js";
document.addEventListener("alpine:init", () => {
    Alpine.data("acknowledgement", (props) => ({
        orders: props.orders || [],
        searchQuery: '',
        filteredOrders() {
            return this.orders.filter((order) => 
                (order.orderInvoice.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                (order.orderPaymentReference.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                (order.customerName.toLowerCase().includes(this.searchQuery.toLowerCase())
            ))))
        },
        
        acknowledge(transactionId, orders) {

            if (confirm('Are you sure?')) {
                printJS({printable: 'printable', type: 'html'})

                useForm(`/cashiers/acknowledgements/${transactionId}`, {}, {}, '/cashiers/acknowledgements')
            } else {
                return;
            }
        },

        reject(transactionId, orders) {
            if (confirm('Are you sure you want to reject this order?')) {

                useForm(`/cashiers/reject/${transactionId}`, {}, {}, '/cashiers/acknowledgements')
            } else {
                return;
            }
        },

        onCancelled(id) {
            console.log('cancel')
            axios.patch(`/my-account/orders/${id}/cancel-confirm`)
                .then(() => {
                    location.reload()
                })
                .catch(error => console.log(error))
        }
    }))
})