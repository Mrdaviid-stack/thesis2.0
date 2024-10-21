import Alpine from "alpinejs"
import useForm from "../../useForms"
import useDropzone from "../../useDropzone"

document.addEventListener("alpine:init", () => {
    Alpine.data('pages', (props) => ({
        form: {...props.formData},
        redirect: props.redirect,
        errors: {},

        init() {
            console.log(this.form)
            const dropzone = useDropzone('._dropzone',(path) => this.form.files = path)
            if (this.form && this.form.files) {
                const mockFile = { name: 'edit', size: 123456 };
                dropzone.emit("addedfile", mockFile);
                dropzone.emit("thumbnail", mockFile, `https://bsd-international.onrender.com/${this.form.files}`);
                dropzone.emit("complete", mockFile);
                dropzone.files.push(mockFile);
            }
        },

        async submit() {
            this.form.content = tinymce.get('content').getContent()
            const form = document.getElementById("form");
            console.log(this.form)
            useForm(form.action, this.form, this.errors, this.redirect)
        }
    }))
})