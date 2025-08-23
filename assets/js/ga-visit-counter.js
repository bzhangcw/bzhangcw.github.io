// Google Analytics Visit Counter
(function() {
    function updateGACounter() {
        const counterElement = document.getElementById('visit-counter');
        if (!counterElement) return;

        // Show loading state
        counterElement.textContent = '...';
        
        // Fetch visit count from server
        fetch('/api/ga-visits')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Update the counter with GA data
                const totalVisits = data.totalVisits || 0;
                const recentPageViews = data.recentPageViews || 0;
                
                counterElement.textContent = totalVisits.toLocaleString();
                counterElement.title = `Total pageviews: ${totalVisits.toLocaleString()}\nLast 7 days: ${recentPageViews.toLocaleString()}`;
            })
            .catch(error => {
                console.error('Error fetching GA data:', error);
                // Fallback to showing a dash if GA data is unavailable
                counterElement.textContent = '-';
                counterElement.title = 'Analytics data unavailable';
            });
    }

    // Update when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateGACounter);
    } else {
        updateGACounter();
    }

    // Refresh counter every 5 minutes
    setInterval(updateGACounter, 5 * 60 * 1000);
})(); 