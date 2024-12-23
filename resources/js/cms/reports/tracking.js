import Alpine from "alpinejs"
import axios from "axios"
import moment from "moment"

document.addEventListener("alpine:init", () => {
    Alpine.data('tracking', (props) => ({
        date: {
            start: moment(new Date()).format('YYYY-MM-DD'),
            end: moment(new Date()).format('YYYY-MM-DD'),
        },
        initialData: [],
        tracking: [],

        init() {
            this.generateTracking()
        },

        filteredTracking(filter = 'all') {
            if (filter === 'all') {
                this.generateTracking()
            }
            this.tracking = this.initialData.filter(trk => trk.status === filter)
        },

        generateTracking() {
            axios.get('/cms/reports/tracking/generate', { params: { start: this.date.start, end: this.date.end } })
                .then((response) => {
                    console.log(response.data, 'data')
                    this.initialData = response.data.tracking
                    this.tracking = this.initialData
                })
        }
    }))
})