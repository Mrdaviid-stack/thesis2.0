import Alpine from "alpinejs"
import axios from "axios"
import moment from "moment"
import _ from "lodash"

document.addEventListener("alpine:init", () => {
    Alpine.data('histories', (props) => ({
        date: {
            start: moment(new Date()).format('YYYY-MM-DD'),
            end: moment(new Date()).format('YYYY-MM-DD'),
        },
        cacheHistories: [],
        histories: [],
        page: 0,
        chunkSize: 0,

        init() {
            this.generateHistories()
        },

        generateHistories() {
            axios.get('/cms/reports/history/generate', { params: { start: this.date.start, end: this.date.end } })
                .then((response) => {
                    console.log(response)
                    this.chunkSize = _.chunk(response.data.data, 10).length
                    this.cacheHistories = _.chunk(response.data.data, 10);
                    this.histories = this.cacheHistories[this.page]
                })
        },
        setPage(index) {
            this.page + 1
            this.histories = this.cacheHistories[index]
        },
        nextPage(index) {
            this.histories = this.cacheHistories[this.page + 1]
        },
        prevPage(index) {
            this.histories = this.cacheHistories[this.page - 1]
        }
    }))
})