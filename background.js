// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sendPageInfo") {
        // Forward the message to the side panel (scripts.js)
        chrome.runtime.sendMessage({
            action: "displayPageInfo",
            data: message.data
        });
    }
});