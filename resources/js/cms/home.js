import Alpine from "alpinejs"
import Chart from "chart.js/auto";


document.addEventListener("alpine:init", () => {
    Alpine.data('home', (props) => ({
        chart: null,
        salesData: props.monthlySales, //[300, 400, 200, 500, 600, 700, 800, 300, 400, 500, 600, 700], // Sample monthly sales data
        labels: [
            'January', 'February', 'March', 'April', 'May', 
            'June', 'July', 'August', 'September', 'October', 
            'November', 'December'
        ],

        init() {
            const ctx = document.getElementById('myChart').getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: this.labels,
                    datasets: [{
                        label: 'Monthly Sales',
                        data: this.salesData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                        },
                        title: {
                            display: true,
                            text: 'Monthly Sales Data'
                        }
                    }
                }
            });
        },

        updateSalesData() {
            // Simulate data update
            this.salesData = this.salesData.map(() => Math.floor(Math.random() * 1000));
            this.chart.data.datasets[0].data = this.salesData;
            this.chart.update();
        }
    }))
})