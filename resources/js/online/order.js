import Alpine from "alpinejs";
import axios from "axios";
import ImageZoom from "js-image-zoom";
import useForm from "../useForms"

document.addEventListener("alpine:init", () => {
    Alpine.data("myOrder", (props) => ({
        orders: props.orders || [],
        activeReceiptOrder: null, 
        showModal: false,
        replacementProofPath: '',
        replacementReason: '',


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
        },

                // optional: reset modal
        closeModal() {
            this.showModal = false;
            this.activeReceiptOrder = null;
        },
        onUploadProof(event) {
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
                this.replacementProofPath = res.data.location;
            })
            .catch(err => {
                console.error('Receipt upload failed:', err);
            })
            .finally();
        },

        onReturn(transactionID) {
            console.log('cancel')
            axios.patch(`/my-account/orders/${transactionID}/exchange`, { 
                 proof: this.replacementProofPath,
                 reason: this.replacementReason
            })
                .then(() => {
                    location.reload()
                })
                .catch(error => console.log(error))
        },
    }))
})