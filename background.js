let lastFocusedTime = null;

chrome.idle.onStateChanged.addListener((newState) => {
    if (newState === "active") {
        // User is active, potentially switched tabs
        lastFocusedTime = Date.now();
    }
});


chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({ 'restrictedWebsites': [] });
  });
  
  // Listen for messages from popup or content script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'getRestrictedWebsites') {
      const restrictedWebsites = getRestrictedWebsites();
      sendResponse({ restrictedWebsites });
    } else if (message.action === 'addRestrictedWebsite') {
      const { website } = message;
      const success = addRestrictedWebsite(website);
      const restrictedWebsites = getRestrictedWebsites();
      sendResponse({ success, restrictedWebsites });
    } else if (message.action === 'removeRestrictedWebsite') {
      const { websiteToRemove } = message;
      const success = removeRestrictedWebsite(websiteToRemove);
      const restrictedWebsites = getRestrictedWebsites();
      sendResponse({ success, restrictedWebsites });
    }
    return true; // Needed to keep the message channel open for sendResponse
  });
  
  // Get the list of restricted websites from storage
  function getRestrictedWebsites() {
    const data = chrome.storage.sync.get('restrictedWebsites');
    return data.restrictedWebsites || [];
  }
  
  // Add a website to the restricted list
  function addRestrictedWebsite(website) {
    let restrictedWebsites = getRestrictedWebsites();
    if (!restrictedWebsites.includes(website)) {
      restrictedWebsites.push(website);
      chrome.storage.sync.set({ 'restrictedWebsites': restrictedWebsites });
      return true;
    }
    return false;
  }
  
  // Remove a website from the restricted list
  function removeRestrictedWebsite(websiteToRemove) {
    let restrictedWebsites = getRestrictedWebsites();
    const index = restrictedWebsites.indexOf(websiteToRemove);
    if (index !== -1) {
      restrictedWebsites.splice(index, 1);
      chrome.storage.sync.set({ 'restrictedWebsites': restrictedWebsites });
      return true;
    }
    return false;
  }
  