import Alpine from "alpinejs";
import ImageZoom from "js-image-zoom";
import useForm from "../useForms"
import axios from "axios";
import alertify from "alertifyjs";
document.addEventListener("alpine:init", () => {
    Alpine.data("orderTracking", (props) => ({
        orders: props.orders || [],
        riders: props.riders || [],
        searchQuery: '',
        isDisabled: false,
        activeReceiptOrder: null, 
        showModal: false,
        finalReceipt: '',
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
            this.orders = props.orders.filter(order => (status === 'all') ? order :  order.orderDeliveryStatus === status)
        },
        uploadbalanceReceipt(event, orderTransactionId) {
            console.log(event.target.files[0])
            const file = event.target.files[0];

            if (!(file instanceof File)) return;

            const imageData = new FormData();
            imageData.append('image', file);

            const path = '/cms/files/uploads';

            axios.post(path, imageData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res => {
                // Save uploaded file path to orderDetails.receipt
                console.log('Receipt uploaded:', res);
                this.finalReceipt = res.data.location;
                axios.post(`/cashiers/order-tracking/receipt/${orderTransactionId}`, {receipt: res.data.location})
                    .then(res => {
                        console.log('Receipt saved:', res);
                        alertify.success('Receipt uploaded successfully!');
                    })
                    .catch(err => {
                        console.error('Failed to save receipt:', err);
                    });
            })
            .catch(err => {
                console.error('Receipt upload failed:', err);
            })
            .finally();
        },
                // optional: reset modal
        closeModal() {
            this.showModal = false;
            this.activeReceiptOrder = null;
        }
    }))
})