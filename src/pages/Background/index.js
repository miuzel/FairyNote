/* global chrome */

import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

import '../../assets/img/icon16.png';
import '../../assets/img/icon32.png';
import '../../assets/img/icon48.png';
import '../../assets/img/icon128.png';
import '../../assets/img/icon.svg';
// Called when the user clicks on the page action
chrome.pageAction.onClicked.addListener(function (tab) {
    // Send a message to the active tab
    chrome.tabs.sendMessage(
       tab.id,
       { "message": "clicked_page_action" }
    );
 });

 chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log(changeInfo)
    if(changeInfo.status === 'complete'){
      chrome.pageAction.show(tabId);
    }
    if(changeInfo.status === 'loading'){
         chrome.tabs.sendMessage(
           tabId,
           { "message": "url_change" }
         )
    }
 });