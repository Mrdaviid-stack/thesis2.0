import Alpine from "alpinejs"
import axios from "axios"
import moment from "moment"

document.addEventListener("alpine:init", () => {
    Alpine.data('sales', (props) => ({
        date: {
            start: moment(new Date()).format('YYYY-MM-DD'),
            end: moment(new Date()).format('YYYY-MM-DD'),
        },
        totalSales: 0,
        transactions: [],

        init() {
            this.generateSales()
        },

        generateSales() {
            axios.get('/cms/reports/sales/generate', { params: { start: this.date.start, end: this.date.end } })
                .then((response) => {
                    this.totalSales = response.data.totalSales;
                    this.transactions = response.data.transactions;
                })
        }
    }))
})