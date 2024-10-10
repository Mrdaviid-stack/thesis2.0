import Alpine from "alpinejs";
import axios from "axios";
import * as alertify from "alertifyjs";
import Dropzone from "dropzone";

document.addEventListener('alpine:init', () => {
    Alpine.data('useForm', (props) => ({
        errors: {},
        redirect: props.redirect,
        dropzone: null,
        files: props.images,
        csrf: document.querySelector('input[name="_csrf"]').value,

        init() {
            this.dropzone = new Dropzone("._dropzone", {
                url: "/files/tinymce/uploads",
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('input[name="_csrf"]').value
                },
                dictDefaultMessage: 'Drop files here or click to upload.',
                maxfiles: 1,
                acceptedfiles: 'image/*',
                addRemoveLinks: true,
            });

            if (this.files !== '') {

                if (Array.isArray(this.images)) {
                    let mockFile = { name: "Filename 2", size: 12345 };
                    this.files.map(image =>{
                        this.dropzone.displayExistingFile(mockFile, `http://cms-alpine.localhost:3333/${image.replace(/"/g, '')}`);
                    })
                } else {
                    let mockFile = { name: "Filename 2", size: 12345 };
                    this.dropzone.displayExistingFile(mockFile, `http://cms-alpine.localhost:3333/${this.files.replace(/"/g, '')}`);
                }
            }

        },

        async submitForm() {
    
            const form =document.getElementById("form");
            const formData = new FormData(form);

            if (this.dropzone) {
                this.dropzone.files.forEach(file => {
                    formData.append('files[]', file)
                })
            }

            try {
                const response = await axios.post(form.action, formData)
                alertify.success(response.data.message)
                setTimeout(() => {
                    if (this.redirect) {
                        location.href = this.redirect
                    } else location.reload()
                }, 1000)
            } catch (error) {
                const { response, status } = error;
                if (status === 404) { 
                    console.log(response)
                }
                if (status === 422) {
                    for (const error of response.data) {
                        this.errors[error.field] = error.message;
                    }
                }
            }
        },
    }));
});