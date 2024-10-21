import Alpine from "alpinejs";
import ImageZoom from "js-image-zoom";
import useForm from "../useForms"
document.addEventListener("alpine:init", () => {
    Alpine.data("auth", (props) => ({
        form: {...props.form},
        redirect: props.redirect,
        errors: {},

        async submit() {
            const form = document.getElementById("form");
            console.log(this.form)
            useForm(form.action, this.form, this.errors, this.redirect)
        }
    }))
})