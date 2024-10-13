import Alpine from "alpinejs"
import useForm from "../../useForms"
import useDropzone from "../../useDropzone"

document.addEventListener("alpine:init", () => {
    Alpine.data('categories', (props) => ({
        form: {...props.formData},
        redirect: props.redirect,
        errors: {},

        async submit() {
            const form = document.getElementById("form");
            useForm(form.action, this.form, this.errors, this.redirect)
        }
    }))
})