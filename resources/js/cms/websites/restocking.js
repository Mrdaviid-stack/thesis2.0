import Alpine from "alpinejs"
import axios from "axios";
import useDropzone from "../../useDropzone";
import useForm from "../../useForms";
import Dropzone from "dropzone";
import Quill from 'quill';
import "quill/dist/quill";

document.addEventListener('alpine:init', () => {
    Alpine.data('restocking', (props) => ({
        form: {...props.formData},
        redirect: props.redirect,
        errors: {},

        async submit() {
            const form = document.getElementById("form");
            useForm(form.action, this.form, this.errors, this.redirect)
        }

    }))
})