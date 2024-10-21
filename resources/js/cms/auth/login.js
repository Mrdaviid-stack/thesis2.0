import Alpine from "alpinejs"
import useForm from "../../useForms"
import axios from "axios";
import alertify from "alertifyjs";

document.addEventListener("alpine:init", () => {
    Alpine.data('login', (props) => ({
        form: {...props.formData},
        redirect: props.redirect,
        errors: {},

        async submit() {
            const form = document.getElementById("form");
            console.log(this.form)
            //useForm(form.action, this.form, this.errors, this.redirect)
            axios.post(form.action, this.form)
                .then((response) => {
                    console.log("Response received:", response);
                    alertify.success(response.data.message);
                    setTimeout(() => {
                        if (response.data.data[0].name == "Superadmin") {
                            location.href  = '/cms'
                        } else {
                            location.href = '/cashiers'
                        }
                    }, 1000);
                })
                .catch((error) => {
                    const { response, status } = error;
                    console.error("Error occurred:", error);
        
                    if (status === 404) {
                        console.log("Not found:", response);
                    } else if (status === 422) {
                        console.log("Validation errors:", response.data);
                        for (const error of response.data) {
                            this.errors[error.field] = error.message;
                        }
                    } else {
                        console.error("Unexpected error:", response);
                    }
                });
        }
    }))
})