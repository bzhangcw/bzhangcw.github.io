function filterPublications() {
    const selectedYear = document.getElementById('yearSelect').value;
    const selectedTag = document.getElementById('tagSelect').value;
    const publicationItems = document.querySelectorAll('.publication-item');

    publicationItems.forEach(item => {
        const yearSpan = item.querySelector('.publication-year');
        const tags = item.querySelectorAll('.publication-tags span');

        // Check year match
        let yearMatch = false;
        if (selectedYear === 'all') {
            yearMatch = true;
        } else if (yearSpan) {
            const itemYear = yearSpan.textContent.trim();
            yearMatch = (itemYear === selectedYear);
        }

        // Check tag match
        let tagMatch = false;
        if (selectedTag === 'all') {
            tagMatch = true;
        } else {
            tags.forEach(tag => {
                if (tag.textContent.trim() === selectedTag) {
                    tagMatch = true;
                }
            });
        }

        // Show item only if BOTH year AND tag match (AND logic)
        if (yearMatch && tagMatch) {
            item.classList.remove('hidden', 'fade');
        } else {
            item.classList.add('hidden');
        }
    });
}

// Sort publications by year (newest first)
function sortPublicationsByYear() {
    const publicationContainer = document.querySelector('.post');
    const publicationItems = Array.from(document.querySelectorAll('.publication-item'));

    publicationItems.sort((a, b) => {
        const yearA = a.querySelector('.publication-year').textContent.trim();
        const yearB = b.querySelector('.publication-year').textContent.trim();
        return parseInt(yearB) - parseInt(yearA); // Sort descending (newest first)
    });

    // Re-append sorted items
    publicationItems.forEach(item => {
        publicationContainer.appendChild(item);
    });
}

// Initialize filter and sorting on page load
document.addEventListener('DOMContentLoaded', function () {
    sortPublicationsByYear();
    filterPublications();
}); 