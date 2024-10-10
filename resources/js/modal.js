document.querySelectorAll('#modal, #modal-lg, #modal-xl').forEach(modal => {
    modal.addEventListener('show.bs.modal', function (event) {
        const target = event.target
        const relatedTarget = event.relatedTarget

        if (relatedTarget && relatedTarget.href) {
            // Load content into modal
            fetch(relatedTarget.href)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.text();
                })
                .then(html => {
                    if (html.trim() === '') {
                        target.querySelector('.modal-content').innerHTML = '<p>No content available.</p>'; // Handle empty response
                    } else {
                        target.querySelector('.modal-content').innerHTML = html;
                    }
                })
                .catch(err => {
                    console.error('Failed to load content:', err); // Handle errors
                    target.querySelector('.modal-content').innerHTML = '<p>Error loading content. Please try again later.</p>'; // Display error message
                });
        }
    });
});