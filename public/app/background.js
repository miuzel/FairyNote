/* global chrome */
// Called when the user clicks on the page action
chrome.pageAction.onClicked.addListener(function (tab) {
   // Send a message to the active tab
   chrome.tabs.sendMessage(
      tab.id,
      { "message": "clicked_page_action" }
   );
});
// Put page action icon on all tabs
// chrome.tabs.onUpdated.addListener(function (tabId) {
//    chrome.pageAction.show(tabId);
// });
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   if(changeInfo.status === 'complete'){
      if (tab.url.match(/https:\/\/www.youtube.com\/.*/)) {
          chrome.pageAction.show(tabId);
      } else {
          chrome.pageAction.hide(tabId);
      }
   }
});

// chrome.commands.onCommand.addListener(function (command) {
//    chrome.tabs.query({ currentWindow: true }, function (tabs) {
//       if(tabs){
//          let activeIndex = tabs.findIndex((tab) => { return tab.active; });
//          chrome.tabs.sendMessage(
//             tabs[activeIndex].id,
//             { "message": command }
//          );
//       } //todo no tabs warning
//    });
// });

// chrome.runtime.onInstalled.addListener(function () {
//    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
//       console.log("Page Change fired");
//       chrome.declarativeContent.onPageChanged.addRules([{
//          conditions: [new chrome.declarativeContent.PageStateMatcher({
//             pageUrl: { urlContains: "youtube.com" },
//          })
//          ],
//          actions: [new chrome.declarativeContent.ShowPageAction()]
//       }]);
//    });
// });