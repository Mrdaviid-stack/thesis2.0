import Alpine from "alpinejs";

document.addEventListener('alpine:init', () => {
    Alpine.data('breadcrumb', () => {
        return {
            segments: [],
            init() {
                this.segments = this.getSegments(); // Call getSegments on initialization
            },
            getSegments() {
                const path = window.location.pathname;
                return path.split('/').filter(segment => segment); // Split and filter out empty segments
            },
            getUrl(index) {
                console.log(index)
                console.log(this.segments.slice(0, index + 1).join('/'))
                return '/' + this.segments.slice(0, index).join('/'); // Construct the URL for each segment
            },
            capitalize(segment) {
                return segment.charAt(0).toUpperCase() + segment.slice(1); // Capitalize first letter
            }
        };
    });
});