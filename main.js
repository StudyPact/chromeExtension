debugger;

console.log("LOADED");
var activeTabID = 0;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab && tab.active)
    console.log("TAB UPDATED:", tab.url);
});

chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {
  if (tab && tab.active)
    console.log("TAB CREATED:", tab.url);
});

chrome.tabs.onActivated.addListener(function(tabId) {
  activeTabID = tabId;
  chrome.tabs.getSelected(null, function(tab) {
    if (tab)
      console.log("TAB ACTIVATED:", tab.url);
  });
});