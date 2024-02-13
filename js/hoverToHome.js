// Define hoverTimeout outside the event listeners for global access
var hoverTimeout;

document.getElementById('hoverToHome').addEventListener('mouseenter', function() {
    // Apply the clip-path effect for visual change
    document.getElementById('overlayHome').style.clipPath = 'circle(75% at 50% 50%)';
    
    // Clear any previous timeout to ensure we don't stack timeouts
    clearTimeout(hoverTimeout);
    
    // Set a new timeout to navigate after 2 seconds
    hoverTimeout = setTimeout(function() {
        window.location.href = 'index.html'; // Navigation action
    }, 1500);
});

document.getElementById('hoverToHome').addEventListener('mouseleave', function() {
    // Reverse the clip-path effect when hover is ended
    document.getElementById('overlayHome').style.clipPath = 'circle(0% at 50% 50%)';
    
    // Clear the navigation timeout if hover ends before the timeout completes
    clearTimeout(hoverTimeout);
});
