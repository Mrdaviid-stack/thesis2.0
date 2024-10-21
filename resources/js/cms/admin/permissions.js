import Alpine from "alpinejs"
import useForm from "../../useForms"

document.addEventListener("alpine:init", () => {
    Alpine.data('permissions', (props) => ({
        form: {...props.formData},
        redirect: props.redirect,
        errors: {},

        async submit() {
            console.log(this.form)
            const form = document.getElementById("form");
            const data = new FormData(form)
            console.log(data)
            useForm(form.action, data, this.errors, this.redirect)
        }
    }))
})