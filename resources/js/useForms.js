import alertify from "alertifyjs";
import axios from "axios"

export default function useForm(url, formData, errors, redirect) {
    console.log("Redirect URL:", redirect);
    console.log("Form Data:", formData);

    axios.post(url, formData)
        .then((response) => {
            console.log("Response received:", response);
            alertify.success(response.data.message);
            setTimeout(() => {
                if (redirect) {
                    location.href = redirect;
                } else {
                    location.reload();
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
                    errors[error.field] = error.message;
                }
            } else {
                console.error("Unexpected error:", response);
            }
        });
}