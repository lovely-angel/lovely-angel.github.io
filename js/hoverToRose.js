// Define hoverTimeout outside the event listeners for global access
var hoverTimeout;

// Function to handle the navigation action
function navigateToRosePage() {
    window.location.href = '/pages/rose.html'; // Navigation action
}

document.getElementById('hoverToRose').addEventListener('mouseenter', function() {
    // Apply the clip-path effect for visual change
    document.getElementById('overlayRose').style.clipPath = 'circle(75% at 50% 50%)';
    
    // Clear any previous timeout to ensure we don't stack timeouts
    clearTimeout(hoverTimeout);
    
    // Set a new timeout to navigate after 2 seconds
    hoverTimeout = setTimeout(navigateToRosePage, 1500);
});

document.getElementById('hoverToRose').addEventListener('mouseleave', function() {
    // Reverse the clip-path effect when hover is ended
    document.getElementById('overlayRose').style.clipPath = 'circle(0% at 50% 50%)';
    
    // Clear the navigation timeout if hover ends before the timeout completes
    clearTimeout(hoverTimeout);
});

// For mobile devices, add touch event listeners
document.getElementById('hoverToRose').addEventListener('click', function() {
    // Apply the clip-path effect for visual change
    document.getElementById('overlayRose').style.clipPath = 'circle(75% at 50% 50%)';
    
    // Clear any previous timeout to ensure we don't stack timeouts
    clearTimeout(hoverTimeout);
    
    // Set a new timeout to navigate after 2 seconds
    navigateToRosePage();
});
