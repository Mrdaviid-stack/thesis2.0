import Alpine from "alpinejs";
import axios from "axios";

window.Storage = {
    errors: {},
    async useForm() {

        const form =document.getElementById("form");
        console.log(form)
        const formData = new FormData(form);

        try {
            const response = await axios.post(form.action, formData)
            // const response = await fetch(form.action, {
            //     method: form.method,
            //     body: formData,
            // })
            console.log(response)
        } catch (error) {
            
            const { response, status } = error;
            if (status === 404) { 
                console.log(response)
            }
            if (status === 402) {
                for (const error of response.data) {
                    this.errors[error.field] = error.message;
                }
            }
        }
    },
}

Alpine.store('global', window.Storage);