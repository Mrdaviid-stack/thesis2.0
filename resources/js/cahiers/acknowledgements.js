import Alpine from "alpinejs";
import ImageZoom from "js-image-zoom";
import useForm from "../useForms"
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
        acknowledge(transactionId) {
            useForm(`/cashiers/acknowledgements/${transactionId}`, {}, {}, '/cashiers/acknowledgements')
        }
    }))
})