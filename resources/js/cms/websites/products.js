import Alpine from "alpinejs"
import axios from "axios";
import useDropzone from "../../useDropzone";
import useForm from "../../useForms";
import Dropzone from "dropzone";
import Quill from 'quill';
import "quill/dist/quill";

document.addEventListener('alpine:init', () => {
    Alpine.data('products', (props) => ({
        form: {...props.form},
        redirect: props.redirect,
        errors: {},
        variants: props.variants || [],
        quill: null,

        init() {
            this.$nextTick(() => {
                this.initializeEditor();
            });

            this.$nextTick(() => {
                const quill = new Quill(`#editor`, {
                    theme: 'snow',
                })
                quill.clipboard.dangerouslyPasteHTML(0, this.form.content);
                quill.on('text-change', () => {
                    this.form.content = quill.root.innerHTML
                });
            })
        },

        initializeEditor() {

            this.form.variants.forEach((_, index) => {
                let content = this.form.variants[index].feature || ''

                const quill = new Quill(`#editor${index}`, {
                    theme: 'snow',
                })

                quill.clipboard.dangerouslyPasteHTML(0, content);

                quill.on('text-change', () => {
                    this.updateFeature(index, quill.root.innerHTML)
                });


                // tinymce.init({
                //     selector: `#editor${index}`,  // Change this selector to match your HTML
                //     height: 300,
                //     menubar: false,
                //     setup: (editor) => {
                //         editor.setContent(content)

                //         editor.on('change', () => {
                //             console.log(`Editor ${index} changed, new content: ${editor.getContent()}`);
                //             this.updateFeature(index, editor.getContent());
                //         });

                //         editor.on('input', () => {
                //             console.log(`Editor ${index} input, current content: ${editor.getContent()}`);
                //             this.updateFeature(index, editor.getContent());
                //         });
                //     }
                // });

                const dropzoneElement = document.querySelector(`#dropzone_variant${index}`);
                if (Dropzone.instances.some(dropzone => dropzone.element === dropzoneElement)) {
                    // If Dropzone already exists, remove it
                    Dropzone.instances.forEach(dropzone => {
                        if (dropzone.element === dropzoneElement) {
                            dropzone.destroy();
                        }
                    });
                }

                const dropzone = useDropzone(`#dropzone_variant${index}`, (path) => this.form.variants[index].image = path)
                if (this.form && this.form.variants[index].image ) {
                    const mockFile = { name: 'edit', size: 123456 };
                    dropzone.emit("addedfile", mockFile);
                    dropzone.emit("thumbnail", mockFile, `https://bsd-international.onrender.com/${this.form.variants[index].image}`);
                    dropzone.emit("complete", mockFile);
                    dropzone.files.push(mockFile);
                }

            })
   
        },

        updateFeature(index, content) {
            console.log(content)
            this.form.variants[index].feature = content;
        },

        addVariant() {
            this.form.variants.push({id: '', feature: '', color: '', storage: '', stock: '', image: '',sku: '', price: '' })
            this.$nextTick(() => {
                this.initializeEditor(this.form.variants.length - 1);
            });
            console.log(this.form.variants)
        },

        async removeVariant(index,variantId) {
            tinymce.get('editor' + index).remove()
            console.log(index)
            this.form.variants.splice(index, 1);
            console.log(variantId)
            await axios.delete(`/websites/products/variant/${variantId}/delete`)
                .then((response) => {
                    console.log(response)
                })
                .catch((error) => {
                    console.error(error)
                })
        },

        async submit() {
            // this.form.content = tinymce.get('content').getContent()
            const form = document.getElementById("form");
            console.log(this.form)
            useForm(form.action, this.form, this.errors, this.redirect)
        }

    }))
})