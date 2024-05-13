// Get the current tab URL
const currentUrl = window.location.hostname;

// Send a message to the background script to get the restricted websites
chrome.runtime.sendMessage({ action: 'getRestrictedWebsites' }, function(response) {
  const { restrictedWebsites } = response;
  if (restrictedWebsites && restrictedWebsites.includes(getHostname(currentUrl))) {
    // Website is restricted, show a warning message or redirect
    alert('This website is restricted. Please visit a productive website.');
    // You can redirect using window.location.href = 'https://example.com/productive.html';
  }
});

// Utility function to extract hostname from URL
function getHostname(url) {
  return new URL(url).hostname;
}
