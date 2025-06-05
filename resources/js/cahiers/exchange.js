import Alpine from "alpinejs";
import axios from "axios";

document.addEventListener("alpine:init", () => {
    Alpine.data("exchange", (props) => ({
        exchange: props.exchange || [],
        activeReceiptOrder: null, 
        showModal: false,

        init() {
            console.log(this.exchange);
        },
                        // optional: reset modal
        closeModal() {
            this.showModal = false;
            this.activeReceiptOrder = null;
        },

        acceptExchange(transactionID) {
            console.log(transactionID)
            axios.post(`/cashiers/exchange/accept/${transactionID}`)
                .then(() => {
                    //location.reload();
                })
                .catch(error => console.log(error));
        }
    }))
})