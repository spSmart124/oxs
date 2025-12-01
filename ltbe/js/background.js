// var CONFIG = require("./config.json");

// import { tldLocales } from "./locale.js";
// import "./jsforce.min.js";
// import "./sfdc-helper.js";

try {
  importScripts("./config.js");
} catch (e) {
  console.log(e);
}

// const menuText = "VFL (Create local case template)";
chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: "vfl",
    title: CONFIG.menuText,
    type: "normal",
    contexts: ["page", "selection"],
    documentUrlPatterns: ["https://*.force.com/*view"],
  });
});

chrome.contextMenus.onClicked.addListener(function (item, tab) {
  // ...check the URL of the active tab against our pattern and...
  // console.log("OnClickData");
  // console.log(item);
  // console.log("tab");
  // console.log(tab);
  if (item.menuItemId == "vfl") {
    getCaseDetail().then((response) => {
      // console.log("forCECase: " + response.caseNumber);
      // let caseNum = response.caseNumber.split(" ")[0];
      // console.log('caseNum: ' + caseNum);
      console.log("CONFIG.appUrl: " + CONFIG.appUrl);
      console.log("response: " + response);

      // Call the template API
      const templateApi = async () => {
        console.log("CONFIG.appUrl: " + CONFIG.appUrl);
        const templateApiResponse = await fetch(CONFIG.appUrl, {
          method: "POST",
          body: JSON.stringify({
            caseNo: response.caseNumber.split(" ")[0],
            // "caseNo": "04654789_test11",
            orgId: response.orgId,
            // "orgId": "0vTDw2LPOM6jSvJCbmyQSe",
            pod: response.POD,
            runtimeEnvironment: response.secureAgent,
            OSFamily: "",
            issue: response.problemStatement,
            description: response.description,
            observation: "",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Template creationg started.");
        console.log(templateApiResponse);
      };

      templateApi();
      console.log("Template creation completed.");
    });
  }
});

function getCaseDetail() {
  return new Promise(function (resolve, reject) {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      async function (tabs) {
        let caseId = "";
        let tabUrl = new URL(tabs[0].url);
        console.log("tabUrl: " + tabUrl);
        // let serverUrl = "https://infa.my.salesforce.com";
        if (tabUrl.pathname.split("/")[3] == "Case") {
          caseId = tabUrl.pathname.split("/")[4];
          console.log("url split: " + tabUrl.pathname.split("/"));
          console.log("caseId: " + caseId);
          let cookie = await getCookie(tabs[0].url, "sid");
          const instanceUrl = "https://infa.my.salesforce.com";
          const apiVersion = "v61.0"; // e.g., v61.0
          const sessionId = cookie.sid;

          // Encode the SOQL query for safe URL transmission
          const soqlQuery = `SELECT Secure_Agent__c, Org_POD_Location__c, Subject, Description, Org_ID__c,Org_Formula_Id__c,Case_Number__c,owner.email,LastModifiedBy.Manager.Email FROM Case WHERE Id = '${caseId}'`;
          const encodedQuery = encodeURIComponent(soqlQuery);

          // Construct the full endpoint URL
          const endpoint = `${instanceUrl}/services/data/${apiVersion}/query?q=${encodedQuery}`;

          try {
            const response = await fetch(endpoint, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionId}`, // Use the session ID as a Bearer token
              },
            });

            // console.log("response: ");
            // console.log(response);

            if (!response.ok) {
              // Handle HTTP error responses (e.g., 401, 403, 404)
              const errorBody = await response.json();
              throw new Error(
                `API call failed: ${response.status} ${response.statusText} - ${
                  errorBody[0]?.message || ""
                }`
              );
            }

            const data = await response.json();
            console.log("Query Results:", data.records);

            resolve({
              status: 200,
              orgId: data.records[0].Org_ID__c
                ? data.records[0].Org_ID__c
                : data.records[0].Org_Formula_Id__c,
              caseNumber: data.records[0].Case_Number__c,
              email: data.records[0].Owner.Email,
              managerEmail: data.records[0].LastModifiedBy.Manager
                ? data.records[0].LastModifiedBy.Manager.Email
                : "",
              secureAgent: data.records[0].Secure_Agent__c,
              POD: data.records[0].Org_POD_Location__c,
              problemStatement: data.records[0].Subject,
              description: data.records[0].Description,
            });
            // return data.records; // Returns an array of records
          } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
          }
        } else {
          alert("Be in Force.com case tab.!!");
        }
      }
    );
  });
}

function getCookie(iurl, key) {
  return new Promise(function (resolve, reject) {
    chrome.cookies.get(
      { url: iurl.replace("lightning.force", "my.salesforce"), name: key },
      (sessionCookie) => {
        if (!sessionCookie) {
          return;
        }
        resolve({ status: 200, sid: sessionCookie.value });
      }
    );
  });
}
