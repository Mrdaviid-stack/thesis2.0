import Alpine from "alpinejs";
import ImageZoom from "js-image-zoom";
import useForm from "../useForms"
document.addEventListener("alpine:init", () => {
    Alpine.data("shop", (props) => ({
        product: props.product || {},
        variants: props.product.productVariants || [],
        options: { color: '', storage: '' },
        details: {},
        viewImage: '',
        redirect: '/cart',

        init() {
            this.details = undefined
            this.viewImage = this.variants[0].image


            this.$watch('options.color', () => this.options.storage = '')
            this.$watch('options.storage', () => this.details = this.variants.filter(variant => variant.color === this.options.color && variant.storage === this.options.storage)[0] )
            this.$watch('details', () => console.log(this.details.stock))
        },
        get displayPrice() {
            const isPriceMoreThanOne = this.product.productVariants.length > 1

            return isPriceMoreThanOne
                ?   (this.variants[0].price.toLocaleString() == this.variants[this.variants.length - 1 ].price.toLocaleString())
                        ? `₱${this.variants[0].price.toLocaleString()}`
                        : `₱${this.variants[0].price.toLocaleString()} - ₱${this.variants[this.variants.length - 1 ].price.toLocaleString()}`
                :   `₱${this.variants[0].price.toLocaleString()}`
        },
        filterVariant() {
            return this.variants.filter((variant) => variant.color == this.options.color)
        },
        onShowImage(image) {
            this.viewImage = image
        },
        async submit() {
            const form = document.getElementById("form");
            console.log(this.form)
            const value = {
                productId: this.product.id,
                variantId: this.details.id,
            }
            useForm("/cart/add", value, this.errors, this.redirect)
        }
    }))
})