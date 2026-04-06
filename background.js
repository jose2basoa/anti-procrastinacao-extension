const defaultSites = [
  "youtube.com",
  "instagram.com",
  "tiktok.com",
  "twitter.com"
];

let blockedSitesCache = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["blockedSites"], (data) => {
    if (!data.blockedSites) {
      chrome.storage.sync.set({ blockedSites: defaultSites });
      blockedSitesCache = defaultSites;
    } else {
      blockedSitesCache = data.blockedSites;
    }
  });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.blockedSites) {
    blockedSitesCache = changes.blockedSites.newValue || [];
  }
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;

  const extensionPage = chrome.runtime.getURL("blocked.html");
  if (details.url.startsWith(extensionPage)) return;

  const shouldBlock = blockedSitesCache.some(site =>
    details.url.includes(site)
  );

  if (shouldBlock) {
    chrome.tabs.update(details.tabId, {
      url: extensionPage
    });
  }
});