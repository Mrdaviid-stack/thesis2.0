import Alpine from "alpinejs"
import axios from "axios"
import moment from "moment"

document.addEventListener("alpine:init", () => {
    Alpine.data('transaction', (props) => ({
        date: {
            start: moment(new Date()).format('YYYY-MM-DD'),
            end: moment(new Date()).format('YYYY-MM-DD'),
        },
        initialData: [],
        transactions: [],
        invoiceQuery: '',

        init() {
            this.generateTransaction()
        },

        filteredTransaction(filter) {
            if (filter === 'all') {
                this.generateTransaction()
            }
            this.transactions = this.initialData.filter(trk => trk.status === filter)
        },

        invoiceSearch(event) {
            this.transactions = this.initialData.filter(trk => trk.invoice.toLowerCase().includes(event.target.value.toLowerCase()))
        },

        generateTransaction() {
            axios.get('/cms/reports/transaction/generate', { params: { start: this.date.start, end: this.date.end } })
                .then((response) => {
                    console.log(response.data, 'data')
                    this.initialData = response.data
                    this.transactions = this.initialData
                })
        }
    }))
})