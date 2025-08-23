// Enhanced visit counter with session tracking
(function() {
    // Get current date for session tracking
    const today = new Date().toDateString();
    
    // Get stored data
    let totalVisits = localStorage.getItem('totalVisits') || 0;
    let lastVisit = localStorage.getItem('lastVisit') || '';
    let sessionVisits = localStorage.getItem('sessionVisits') || 0;
    
    // Check if this is a new day
    if (lastVisit !== today) {
        // New day, increment total visits
        totalVisits = parseInt(totalVisits) + 1;
        localStorage.setItem('totalVisits', totalVisits);
        localStorage.setItem('lastVisit', today);
        sessionVisits = 1;
    } else {
        // Same day, increment session visits
        sessionVisits = parseInt(sessionVisits) + 1;
    }
    
    localStorage.setItem('sessionVisits', sessionVisits);
    
    // Update display
    function updateCounter() {
        const counterElement = document.getElementById('visit-counter');
        if (counterElement) {
            // Show total visits with formatting
            counterElement.textContent = totalVisits.toLocaleString();
            
            // Add tooltip with session info
            counterElement.title = `Total visits: ${totalVisits.toLocaleString()}\nToday's visits: ${sessionVisits}`;
        }
    }
    
    // Update when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateCounter);
    } else {
        updateCounter();
    }
})(); 