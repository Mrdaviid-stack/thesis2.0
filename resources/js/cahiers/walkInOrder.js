import Alpine from "alpinejs";
import ImageZoom from "js-image-zoom";
import useForm from "../useForms"
document.addEventListener("alpine:init", () => {
    Alpine.data("walkInOrder", (props) => ({
        errors: {},
        products: props.products.data || [],
        productToBuy: {},
        productDetails: {
            variantId: '',
            color: '',
            storage: '',
            price: '',
            qty: 1,
            stock: '',
            paymentType: '',
        },
        init() {
            console.log(this.products)
            this.$watch('productDetails', ()=> {
                const variants = this.productToBuy?.productVariants?.filter(product => (product.color == this.productDetails.color) && (product.storage == this.productDetails.storage))[0]
                this.productDetails.variantId = variants?.id
                this.productDetails.price = variants?.price * this.productDetails.qty
                this.productDetails.stock = variants?.stock
                console.log(this.productDetails)
            })
        },
        filteredStorageVariant() {

            return this.productToBuy?.productVariants?.filter(product => product.color == this.productDetails.color)
        },
        addQTY() {
            this.productDetails.qty++
        },
        subtractQTY() {
            this.productDetails.qty--
        },
        selectProduct(productId) {
            console.log(productId)
            this.productToBuy = this.products.filter((product) => product.id === productId)[0]
        },
        buyNow() {
            useForm('/cashiers/order', this.productDetails, this.errors, '/cashiers')
        }
    }))
})