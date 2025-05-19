import Alpine from "alpinejs"
import axios from "axios"
import moment from "moment"
import _ from "lodash"

document.addEventListener("alpine:init", () => {
    Alpine.data('purchaseHistory', (props) => ({
        date: {
            start: moment(new Date()).format('YYYY-MM-DD'),
            end: moment(new Date()).format('YYYY-MM-DD'),
        },
        cachePurchaseHistory: [],
        purchaseHistories: [],
        page: 0,
        chunkSize: 0,

        init() {
            this.generatePurchaseHistory()
        },

        generatePurchaseHistory() {
            axios.get('/cms/customers/history/generate', { params: { start: this.date.start, end: this.date.end } })
                .then((response) => {
                    console.log(response)
                    this.chunkSize = _.chunk(response.data.data, 10).length
                    this.cachePurchaseHistory = _.chunk(response.data.data, 10);
                    this.purchaseHistories = this.cachePurchaseHistory[this.page]
                })
        },
        setPage(index) {
            this.page + 1
            this.purchaseHistories = this.cacheHistories[index]
        },
        nextPage(index) {
            this.purchaseHistories = this.cacheHistories[this.page + 1]
        },
        prevPage(index) {
            this.purchaseHistories = this.cacheHistories[this.page - 1]
        }
    }))
})