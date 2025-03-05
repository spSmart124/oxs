// import {} from './jforce.min.js';

// importScripts('jforce.min.js');

function getCookie(iurl, key) {
    return new Promise(function (resolve, reject) {
        chrome.cookies.get({ url: iurl.replace("lightning.force", "my.salesforce"), name: key }, (sessionCookie) => {
            if (!sessionCookie) {
                return;
            }
            resolve({ status: 200, sid: sessionCookie.value });
        });
    });
}

function getCaseDetail() {
    return new Promise(function (resolve, reject) {
        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            let caseiD = "";
            let tabUrl = new URL(tabs[0].url);
            console.log('tabUrl: ' + tabUrl);
            let serverUrl = "https://infa.my.salesforce.com";
            if (tabUrl.pathname.split("/")[3] == "Case") {
                caseiD = tabUrl.pathname.split("/")[4];
                let cookie = await getCookie(tabs[0].url, "sid");
                let conn = new jsforce.Connection({
                    version: "53.0",
                    serverUrl: serverUrl,
                    sessionId: cookie.sid,
                });
                // conn.query(`SELECT Org_ID__c,Org_Formula_Id__c,Case_Number__c,owner.email,LastModifiedBy.Manager.Email FROM Case WHERE Id = '${caseiD}'`).then((queryResult) => {
                // conn.query(`SELECT Secure_Agent__c, Org_POD_Location__c, Problem_Statement__c, Description, Org_ID__c,Org_Formula_Id__c,Case_Number__c,owner.email,LastModifiedBy.Manager.Email FROM Case WHERE Id = '${caseiD}'`).then((queryResult) => {
                    conn.query(`SELECT Secure_Agent__c, Org_POD_Location__c, Subject, Description, Org_ID__c,Org_Formula_Id__c,Case_Number__c,owner.email,LastModifiedBy.Manager.Email FROM Case WHERE Id = '${caseiD}'`).then((queryResult) => {
                    // if (queryResult.records[0].Org_ID__c || queryResult.records[0].Org_Formula_Id__c) {
                    //     resolve({
                    //         status: 200,
                    //         orgId: queryResult.records[0].Org_ID__c ? queryResult.records[0].Org_ID__c : queryResult.records[0].Org_Formula_Id__c,
                    //         caseNumber: queryResult.records[0].Case_Number__c,
                    //         email: queryResult.records[0].Owner.Email,
                    //         managerEmail: queryResult.records[0].LastModifiedBy.Manager ? queryResult.records[0].LastModifiedBy.Manager.Email : "",
                    //         secureAgent: queryResult.records[0].Secure_Agent__c,
                    //         POD: queryResult.records[0].Org_POD_Location__c,
                    //         problemStatement: queryResult.records[0].Problem_Statement__c,
                    //         description: queryResult.records[0].Description
                    //     });
                    // } else {
                    //     alert("OrgId is empty in salesforce Case Object!!");
                    // }
                resolve({
                        status: 200,
                        orgId: queryResult.records[0].Org_ID__c ? queryResult.records[0].Org_ID__c : queryResult.records[0].Org_Formula_Id__c,
                        caseNumber: queryResult.records[0].Case_Number__c,
                        email: queryResult.records[0].Owner.Email,
                        managerEmail: queryResult.records[0].LastModifiedBy.Manager ? queryResult.records[0].LastModifiedBy.Manager.Email : "",
                        secureAgent: queryResult.records[0].Secure_Agent__c,
                        POD: queryResult.records[0].Org_POD_Location__c,
                        problemStatement: queryResult.records[0].Subject,
                        description: queryResult.records[0].Description
                    });
                }).catch((error) => {
                    console.log("SOQL Error: " + JSON.stringify(error));
                });
            } else {
                alert("Be in Force.com case tab.!!");
            }
        });
    });
}

function sfdcQueryRunner(tab, sqlQuery) {
    return new Promise(async function (resolve, reject) {
        let cookie = await getCookie(tab.url, "sid");
        let serverUrl = "https://infa.my.salesforce.com";
        let conn = new jsforce.Connection({
            version: "53.0",
            serverUrl: serverUrl,
            sessionId: cookie.sid,
        });
        let queryResult = await conn.query(sqlQuery);
        resolve(queryResult);
    });
}

function getCaseNumber() {
    return new Promise(function (resolve, reject) {
        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            let tabUrl = new URL(tabs[0].url);
            if (tabUrl.pathname.split("/")[3] == "Case") {
                alert(Object.keys(localStorage));
                let allCases = localStorage.getItem("consolePersistenceState:06m3f0000008XCpAAM:Base");
                console.log(allCases)
                let currentCase = allCases.workspaces.filter(tab => tab.active);
                if (currentCase.length) {
                    resolve({ status: 200, caseNumber: currentCase.title });
                }
            } else {
                alert("Be in Force.com case tab.!!");
            }
        });
    });
}

function sanitizeData(input) {
    return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
