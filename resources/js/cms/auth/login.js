import Alpine from "alpinejs"
import useForm from "../../useForms"

document.addEventListener("alpine:init", () => {
    Alpine.data('login', (props) => ({
        form: {...props.formData},
        redirect: props.redirect,
        errors: {},

        async submit() {
            const form = document.getElementById("form");
            console.log(this.form)
            useForm(form.action, this.form, this.errors, this.redirect)
        }
    }))
})