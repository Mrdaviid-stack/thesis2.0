import Alpine from "alpinejs"
import useForm from "../../useForms"
import useDropzone from "../../useDropzone"
import Quill from 'quill';
import "quill/dist/quill";

document.addEventListener("alpine:init", () => {
    Alpine.data('pages', (props) => ({
        form: {...props.formData},
        redirect: props.redirect,
        errors: {},

        init() {
            this.$nextTick(() => {
                this.initializeEditor();
            })
            const dropzone = useDropzone('._dropzone',(path) => this.form.files = path)
            if (this.form && this.form.files) {
                const mockFile = { name: 'edit', size: 123456 };
                dropzone.emit("addedfile", mockFile);
                dropzone.emit("thumbnail", mockFile, `https://bsd-international.onrender.com/${this.form.files}`);
                //dropzone.emit("thumbnail", mockFile, `http://localhost:3333/${this.form.files}`);
                dropzone.emit("complete", mockFile);
                dropzone.files.push(mockFile);
            }
        },
        initializeEditor() {
            const quill = new Quill('#content', {
                theme: 'snow'
            });

            quill.clipboard.dangerouslyPasteHTML(0, this.form.content)
            quill.on('text-change', () => {
                console.log(quill.root.innerHTML)
                this.form.content = quill.root.innerHTML
            });
        },

        async submit() {
            //this.form.content = tinymce.get('content').getContent()
            const form = document.getElementById("form");
            console.log(this.form)
            useForm(form.action, this.form, this.errors, this.redirect)
        }
    }))
})