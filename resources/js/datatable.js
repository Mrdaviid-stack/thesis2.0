import Alpine from "alpinejs";
import * as alertify from "alertifyjs";
import axios from "axios";
import moment from "moment";

document.addEventListener('alpine:init', () => {
    Alpine.data('datatable', (props) => {
        return {
            records: props.records || [],
            selectedItems: [],
            searchQuery: '',
            sortColumn: 'name',
            sortDirection: 'asc',
            selectAll: false,
            get filteredRecords() {
                const filtered = this.records.filter(record => 
                    record.name.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
                return this.sort(filtered);
            },
            toggleSelectAll() {
                this.selectAll = !this.selectAll;
                this.selectedItems = this.selectAll ? this.filteredRecords.map(record => record.id) : [];
            },
            sort(records) {
                return records.sort((a, b) => {
                    let aValue, bValue;

                    if (this.sortColumn === 'createdAt') {
                        aValue = new Date(a[this.sortColumn]);
                        bValue = new Date(b[this.sortColumn]);
                    } else {
                        aValue = a[this.sortColumn].toString().toLowerCase();
                        bValue = b[this.sortColumn].toString().toLowerCase();
                    }

                    if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
                    if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
                    return 0;
                })
            },
            onChangeSort(order) {
                if (order === 'a-z') {
                    this.sortColumn = 'name';
                    this.sortDirection = 'asc';
                } else if (order === 'z-a') {
                    this.sortColumn = 'name';
                    this.sortDirection = 'desc';
                } else if (order === 'asc' || order === 'desc') {
                    this.sortColumn = 'createdAt'
                    this.sortDirection = order
                }
            },
            onUpdate(action) {
                console.log(action)
            },
            onDelete() {
                const items = this.selectedItems.map(id => parseInt(id));
                const count = items.length;
                const url = window.location.pathname;
                alertify.confirm('Confirm Deletion', `Are you sure you want to permanently remove ${count} ${(count > 1) ? 'items' : 'item'} `, 
                    () => {
                        axios.delete(url + '/delete', {
                                headers: { 'Content-Type': 'application/json' },
                                data: items
                            })
                            .then(response => {
                                alertify.success(response.data.message)
                                setTimeout(() => {
                                    location.reload() 
                                }, 1000)
                            }) 
                    }, 
                    () => { 
                        alertify.error('Cancel')
                    }
                );
            },
            formatDate(date) {
                return moment(date).format('MMMM Do YYYY h:mm:ss A')
            }
        }
    });
});