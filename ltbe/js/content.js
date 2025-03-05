console.log("From content.js");
// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    console.log("From content script " + msg.text);
    console.log(sender);
    console.log(sendResponse);
    if (msg.text === 'report_back') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        // let caseNumber: number = document.querySelector("p");
        console.log(document);
        sendResponse(document);
    }
});
console.log("From content.js");
// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    console.log("From content script " + msg.text);
    console.log(sender);
    console.log(sendResponse);
    if (msg.text === 'report_back') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        // let caseNumber: number = document.querySelector("p");
        console.log(document);
        sendResponse(document);
    }
});
