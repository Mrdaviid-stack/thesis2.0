import Alpine from "alpinejs"
import axios from "axios"
import moment from "moment"

document.addEventListener("alpine:init", () => {
    Alpine.data('histories', (props) => ({
        date: {
            start: moment(new Date()).format('YYYY-MM-DD'),
            end: moment(new Date()).format('YYYY-MM-DD'),
        },
        histories: [],

        init() {
            this.generateHistories()
        },

        generateHistories() {
            axios.get('/cms/reports/history/generate', { params: { start: this.date.start, end: this.date.end } })
                .then((response) => {
                    console.log(response)
                    this.histories = response.data.data;
                })
        }
    }))
})