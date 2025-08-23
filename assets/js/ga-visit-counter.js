// Google Analytics Visit Counter
(function() {
    // Prevent multiple instances
    if (window.gaCounterInitialized) return;
    window.gaCounterInitialized = true;
    
    function updateGACounter() {
        const counterElement = document.getElementById('visit-counter');
        if (!counterElement) {
            console.log('GA Counter: No counter element found');
            return;
        }

        // Show loading state
        counterElement.textContent = '...';
        console.log('GA Counter: Fetching real GA data...');
        
        // Fetch visit count from server
        fetch('/api/ga-visits')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('GA Counter: Received data:', data);
                // Update the counter with GA data
                counterElement.textContent = data.totalVisits.toLocaleString();
                counterElement.title = `Total pageviews: ${data.totalVisits.toLocaleString()}\nLast 30 days: ${data.last30Days.toLocaleString()}`;
            })
            .catch(error => {
                console.error('GA Counter: Error fetching GA data:', error);
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