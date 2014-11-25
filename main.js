debugger;

console.log("LOADED");

var retrieveCookie = function(){
  var query = {
    url: "http://studypact-webapp-test.herokuapp.com",
    name: "accessToken"

  };
  chrome.cookies.get(query, function(cookie){
    console.log("GOT DA COOKIE:", cookie);
  })
}

chrome.idle.setDetectionInterval(15);
chrome.idle.onStateChanged.addListener(function(state){
  if (state == "idle"){
    chrome.browserAction.setIcon({path: "icons/ic_not_studying.png"});
  }
  if (state == "active"){
    chrome.browserAction.setIcon({path: "icons/icon.png"});
  }
  console.log("NEW STATE:", state);
})

var getUrl=function(callback){
  var query = {
    active: true,
    currentWindow:true
  };
  chrome.tabs.query(query, function(tab){
    callback(tab[0].url);
  })
}

var activeTabID = 0;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab && tab.active){
    getUrl(function(url){
      console.log("TAB UPDATED:", url);
    })
  }
});

chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {
  if (tab && tab.active){
    getUrl(function(url){
      console.log("TAB CREATED:", url);
    })
  }
});

chrome.tabs.onActivated.addListener(function(tabId) {
  getUrl(function(url){
    console.log("TAB ACTIVATED:", url);
  })
});

chrome.windows.onFocusChanged.addListener(function(){
  getUrl(function(url){
    console.log("WINDOWS FOCUS CHANGED:", url);
  })
});

retrieveCookie();