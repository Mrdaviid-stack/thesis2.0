import Alpine from "alpinejs";
import ImageZoom from "js-image-zoom";
import useForm from "../useForms"
document.addEventListener("alpine:init", () => {
    Alpine.data("auth", (props) => ({
        form: {...props.form},
        redirect: props.redirect,
        errors: {},
        isShowPassword: false,

        async submit() {
            const form = document.getElementById("form");
            useForm(form.action, this.form, this.errors, this.redirect)
            console.log(this.errors, 'errors')
        },

        showPassword() {
            this.isShowPassword = !this.isShowPassword;
        }
    }))
})