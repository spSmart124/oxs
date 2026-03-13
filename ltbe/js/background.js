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
  if (item.menuItemId == "vfl") {
    getSfTemplateRecordFromTab().then((response) => {
      let sfObjType = response.sfObjType;
      let templateUrl = "";
      switch (sfObjType) {
        case SF_OBJECT_TYPE.CASE:
          templateUrl = CONFIG.appUrl + CONFIG.casePath;
          break;
        case SF_OBJECT_TYPE.ENGAGEMENT:
          templateUrl = CONFIG.appUrl + CONFIG.engagementPath;
          break;
        default:
          console.error("Unknown sf object type: " + sfObjType);
      }

      // Call the template API
      const templateApi = async () => {
        const templateApiResponse = await fetch(templateUrl, {
          method: "POST",
          body: JSON.stringify(response.template),
          headers: {
            "Content-Type": "application/json",
          },
        });
      };

      templateApi();
      console.log("Template creation completed.");
    });
  }
});

async function querySfObjUsingCookie(tabs, encodedQuery) {
  let cookie = await getCookie(tabs[0].url, "sid");
  const instanceUrl = "https://infa.my.salesforce.com";
  const apiVersion = "v61.0"; // e.g., v61.0
  const sessionId = cookie.sid;

  // Construct the full endpoint URL
  const endpoint = `${instanceUrl}/services/data/${apiVersion}/query?q=${encodedQuery}`;
  console.log("Inside querySfObjUsingCookie. endpoint: "); // Remove later
  console.log(endpoint);

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
        `API call failed: ${response.status} ${response.statusText} - ${errorBody[0]?.message || ""
        }`
      );
    }
    // return data.records; // Returns an array of records
    const data = await response.json();
    console.log("Inside querySfObjUsingCookie. data: "); // Remove later
    console.log(data); // Remove later
    return data.records;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

function getSfObjTypeFromTab(tabs) {
  let tabUrl = new URL(tabs[0].url);
  switch (tabUrl.pathname.split("/")[3]) {
    case SF_OBJECT_TYPE.CASE:
      return SF_OBJECT_TYPE.CASE;
    case SF_OBJECT_TYPE.ENGAGEMENT:
      return SF_OBJECT_TYPE.ENGAGEMENT;
    default:
      return SF_OBJECT_TYPE.UNKNOWN;

  }
}

function prepareEncodedSoqlByObjTypeFromTab(tabs) {
  let objId = "";
  let tabUrl = new URL(tabs[0].url);
  let sfObjType = getSfObjTypeFromTab(tabs);
  if (sfObjType == SF_OBJECT_TYPE.CASE || SF_OBJECT_TYPE.ENGAGEMENT) {
    objId = tabUrl.pathname.split("/")[4];
  } else {
    console.error("Be in Force.com case tab!! Url does not contain Case or Engagement__c");
  }

  // Prepare soql query based on sf object type
  let soqlQuery = "";
  if (sfObjType == SF_OBJECT_TYPE.CASE) {
    soqlQuery = `SELECT Secure_Agent__c, Org_POD_Location__c, Subject, Description, Org_ID__c, Org_Formula_Id__c, Case_Number__c FROM ${SF_OBJECT_TYPE.CASE} WHERE Id = '${objId}'`;
  } else if (sfObjType == SF_OBJECT_TYPE.ENGAGEMENT) {
    soqlQuery = `SELECT Engagement_Number__c, Name, Dev_Plan_Name__c, CSM_Summary__c, CST_Comments__c, Closing_Notes__c FROM ${SF_OBJECT_TYPE.ENGAGEMENT} WHERE Id = '${objId}'`;
    // soqlQuery = `SELECT FIELDS(ALL) FROM Engagement__c WHERE Id = '${objId}'`;
  } else {
    console.error("Unhandled object type: " + tabs);
  }

  return encodeURIComponent(soqlQuery);;
}

function getCaseTemplateRecord(record) {
  return {
    "sfObjType": SF_OBJECT_TYPE.CASE,
    "template": {
    caseNo: record.Case_Number__c.split(" ")[0],
    orgId: record.Org_ID__c
      ? record.Org_ID__c
      : record.Org_Formula_Id__c,
    pod: record.Org_POD_Location__c,
    runtimeEnvironment: record.Secure_Agent__c,
    OSFamily: "",
    issue: record.Subject,
    description: record.Description,
    observation: ""
    }
  };
}

function getEngagementTemplateRecord(record) {
  return {
    "sfObjType": SF_OBJECT_TYPE.ENGAGEMENT,
    "template": {
      number: record.Engagement_Number__c,
      name: record.Name,
      account: record.Dev_Plan_Name__c.split("_")[0],
      description: record.CSM_Summary__c,
      csaComments: record.CST_Comments__c,
      closingNotes: record.Closing_Notes__c
    }
  };
}

function getTemplateRecord(sfObjType, records) {
  let record = records[0];
  switch(sfObjType) {
    case "Case":
      return getCaseTemplateRecord(record);
    case "Engagement__c":
      return getEngagementTemplateRecord(record);
  }
}

function getSfTemplateRecordFromTab() {
  return new Promise(function (resolve, reject) {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      async function (tabs) {
        let sfObjType = getSfObjTypeFromTab(tabs);
        const encodedQuery = prepareEncodedSoqlByObjTypeFromTab(tabs);
        let records = await querySfObjUsingCookie(tabs, encodedQuery);
        let templateRecord = getTemplateRecord(sfObjType, records);

        resolve(templateRecord);
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
