// Google Analytics Visit Counter (Fallback Version)
// This version simulates the API response for testing without requiring GA API setup
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
        console.log('GA Counter: Setting loading state');
        
        // Simulate API call with a delay
        setTimeout(() => {
            // Simulated data - replace with actual API call
            const mockData = {
                totalVisits: 1234,
                last30Days: 56,
                timestamp: new Date().toISOString()
            };
            
            console.log('GA Counter: Updating with mock data:', mockData);
            
            // Update the counter with mock data
            counterElement.textContent = mockData.totalVisits.toLocaleString();
            counterElement.title = `Total pageviews: ${mockData.totalVisits.toLocaleString()}\nLast 30 days: ${mockData.last30Days.toLocaleString()}\n(Simulated data - see GA_INTEGRATION_SETUP.md for real integration)`;
        }, 1000);
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