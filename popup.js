document.addEventListener('DOMContentLoaded', function() {
    const websiteInput = document.getElementById('websiteInput');
    const addBtn = document.getElementById('addBtn');
    const websiteList = document.getElementById('websiteList');
  
    // Load stored websites on popup open
    chrome.runtime.sendMessage({ action: 'getRestrictedWebsites' }, function(response) {
      const { restrictedWebsites } = response;
      if (restrictedWebsites) {
        renderWebsites(restrictedWebsites);
      }
    });
  
    // Add website to the list
    addBtn.addEventListener('click', function() {
      const website = websiteInput.value.trim();
      if (website) {
        chrome.runtime.sendMessage({ action: 'addRestrictedWebsite', website }, function(response) {
          if (response.success) {
            renderWebsites(response.restrictedWebsites);
            websiteInput.value = '';

            // Calculate and display time spent
          const currentTime = Date.now();
          const timeSpent = (currentTime - lastFocusedTime) / 1000; // Convert to seconds
          const timeDisplay = document.createElement('span');
          timeDisplay.textContent = `Time spent: ${Math.floor(timeSpent)} seconds`;
          websiteList.appendChild(timeDisplay);
          } else {
            alert('Failed to add website. Please try again.');
          }
        });
      }
    });
  
    // Delete website from the list
    websiteList.addEventListener('click', function(event) {
      if (event.target.classList.contains('deleteBtn')) {
        const websiteToRemove = event.target.dataset.website;
        chrome.runtime.sendMessage({ action: 'removeRestrictedWebsite', websiteToRemove }, function(response) {
          if (response.success) {
            renderWebsites(response.restrictedWebsites);
          } else {
            alert('Failed to remove website. Please try again.');
          }
        });
      }
    });
  
    // Render the list of websites
    function renderWebsites(websites) {
      websiteList.innerHTML = '';
      websites.forEach(site => {
        const li = document.createElement('li');
        li.innerHTML = `${site} <span class="deleteBtn" data-website="${site}">(delete)</span>`;
        websiteList.appendChild(li);
      });
    }
  });
  