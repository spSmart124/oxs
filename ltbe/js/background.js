// var CONFIG = require("./config.json");

const menuText = "VFL (Create local case template)";
chrome.contextMenus.removeAll(function () {
    chrome.contextMenus.create({
        id: "vfl",
        title: menuText,
        type: "normal",
        contexts: ['page', 'selection'],
        documentUrlPatterns: ["https://*.force.com/*view"]
    });
});

chrome.contextMenus.onClicked.addListener(function (item, tab) {
    // ...check the URL of the active tab against our pattern and...
    console.log('OnClickData');
    console.log(item);
    console.log('tab');
    console.log(tab);
    if (item.menuItemId == "vfl") {
        getCaseDetail().then((response) => {
            // console.log("forCECase: " + response.caseNumber);
            let caseNum = response.caseNumber.split(" ")[0];
            // console.log('caseNum: ' + caseNum);
            console.log("CONFIG.appUrl: " + CONFIG.appUrl);
            console.log("response: " + response);

            // Call the template API
            const templateApi = async() => {
                console.log("CONFIG.appUrl: " + CONFIG.appUrl);
                const templateApiResponse = await fetch(CONFIG.appUrl, {
                    method: "POST",
                    body: JSON.stringify({
                        "caseNo": response.caseNumber.split(" ")[0],
                        // "caseNo": "04654789_test11",
                        "orgId": response.orgId,
                        // "orgId": "0vTDw2LPOM6jSvJCbmyQSe",
                        "pod": response.POD,
                        "runtimeEnvironment": response.secureAgent,
                        "OSFamily": "",
                        "issue": response.problemStatement,
                        "description": response.description,
                        "observation": ""
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                console.log("Template creationg started.");
                console.log(templateApiResponse);
            }

            templateApi();
            console.log("Template creation completed.");
        });
    }
});
