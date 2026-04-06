const blockedSites = [
  "youtube.com",
  "instagram.com",
  "twitter.com",
  "tiktok.com"
];

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const url = details.url;

  if (blockedSites.some(site => url.includes(site))) {
    chrome.tabs.update(details.tabId, {
      url: chrome.runtime.getURL("blocked.html")
    });
  }
});