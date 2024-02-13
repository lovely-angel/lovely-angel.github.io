// Define hoverTimeout outside the event listeners for global access
var hoverTimeout;

// Function to handle the navigation action
function navigateToButterfliesPage() {
    window.location.href = '/pages/butterflies.html'; // Navigation action
}

document.getElementById('hoverToButterflies').addEventListener('mouseenter', function() {
    // Apply the clip-path effect for visual change
    document.getElementById('overlayButterflies').style.clipPath = 'circle(75% at 50% 50%)';
    
    // Clear any previous timeout to ensure we don't stack timeouts
    clearTimeout(hoverTimeout);
    
    // Set a new timeout to navigate after 2 seconds
    hoverTimeout = setTimeout(navigateToButterfliesPage, 1500);
});

document.getElementById('hoverToButterflies').addEventListener('mouseleave', function() {
    // Reverse the clip-path effect when hover is ended
    document.getElementById('overlayButterflies').style.clipPath = 'circle(0% at 50% 50%)';
    
    // Clear the navigation timeout if hover ends before the timeout completes
    clearTimeout(hoverTimeout);
});

// For mobile devices, add touch event listeners
document.getElementById('hoverToButterflies').addEventListener('touchstart', function(event) {
    // Prevent the default touch behavior (like scrolling)
    event.preventDefault();
    
    // Apply the clip-path effect for visual change
    document.getElementById('overlayButterflies').style.clipPath = 'circle(75% at 50% 50%)';
    
    // Navigate immediately on touch
    navigateToButterfliesPage();
});
