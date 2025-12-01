Error: XMLHttpRequest is not defined
ReferenceError: XMLHttpRequest is not defined
    at chrome-extension://nodgckfkcdnkeaipjmienghlokoknfio/js/jsforce.min.js:2410:21
    at a (chrome-extension://nodgckfkcdnkeaipjmienghlokoknfio/js/jsforce.min.js:5733:28)
    at a.then (chrome-extension://nodgckfkcdnkeaipjmienghlokoknfio/js/jsforce.min.js:5695:19)
    at h.request (chrome-extension://nodgckfkcdnkeaipjmienghlokoknfio/js/jsforce.min.js:3830:18)
    at r.request (chrome-extension://nodgckfkcdnkeaipjmienghlokoknfio/js/jsforce.min.js:2823:21)
    at chrome-extension://nodgckfkcdnkeaipjmienghlokoknfio/js/jsforce.min.js:4518:36
    at o (chrome-extension://nodgckfkcdnkeaipjmienghlokoknfio/js/jsforce.min.js:12766:22)
    at chrome-extension://nodgckfkcdnkeaipjmienghlokoknfio/js/jsforce.min.js:12817:23
    at r (chrome-extension://nodgckfkcdnkeaipjmienghlokoknfio/js/jsforce.min.js:5849:37)
    at e (chrome-extension://nodgckfkcdnkeaipjmienghlokoknfio/js/jsforce.min.js:5870:54)

Link: https://groups.google.com/a/chromium.org/g/chromium-extensions/c/1v9HDJqZbdA
Google Search: https://www.google.com/search?q=XMLHttpRequest+is+not+defined+at+chrome-extension&rlz=1C1GCER_enIN1169IN1170&oq=XMLHttpRequest+is+not+defined+at+chrome-extension&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIICAEQABgWGB4yDQgCEAAYhgMYgAQYigUyBwgDEAAY7wUyCggEEAAYogQYiQUyCggFEAAYogQYiQUyCggGEAAYogQYiQXSAQczMThqMGo5qAIGsAIB8QXmcKVBLMrNgw&sourceid=chrome&ie=UTF-8


Convert below lines to use fetch()

``` js
function (t, e, n) {
          "use strict";
          function r(t) {
            var e = (t.getAllResponseHeaders() || "").split(/[\r\n]+/);
            return o.map(e, function (t) {
              return t.split(/\s*:/)[0].toLowerCase();
            });
          }
          var i = t("readable-stream").Duplex,
            o = t("lodash/core");
          e.exports = function (t, e) {
            var n = new XMLHttpRequest();
            if ((n.open(t.method, t.url), t.headers))
              for (var s in t.headers) n.setRequestHeader(s, t.headers[s]);
            n.setRequestHeader("Accept", "*/*");
            var a,
              u = new i();
            u._read = function (t) {
              a && u.push(a.body);
            };
            var c = [],
              l = !1;
            return (
              (u._write = function (t, e, n) {
                c.push(t.toString("buffer" === e ? "binary" : e)), n();
              }),
              u.on("finish", function () {
                l || (n.send(c.join("")), (l = !0));
              }),
              (!t.body &&
                "" !== t.body &&
                /^(put|post|patch)$/i.test(t.method)) ||
                (n.send(t.body), (l = !0)),
              (n.onreadystatechange = function () {
                if (4 === n.readyState) {
                  var t = r(n),
                    i = {};
                  o.forEach(t, function (t) {
                    t && (i[t] = n.getResponseHeader(t));
                  }),
                    (a = {
                      statusCode: n.status,
                      headers: i,
                      body: n.response,
                    }),
                    a.statusCode ||
                      ((a.statusCode = 400), (a.body = "Access Declined")),
                    e && e(null, a, a.body),
                    u.end();
                }
              }),
              u
            );
          };
        }
```

SOQL using fetch()

```js
async function fetchSOQLData(sessionId, soqlQuery) {
    // 1. Get the instance URL (e.g., https://yourdomain.my.salesforce.com)
    // This example assumes you have a way to get the base URL dynamically.
    // In a VF page, you could use a merge field. In LWC, you can use built-in modules.
    const instanceUrl = 'https://infa.my.salesforce.com'; 
    const apiVersion = '53.0'; // e.g., v61.0

    // Encode the SOQL query for safe URL transmission
    const encodedQuery = encodeURIComponent(soqlQuery);
    
    // Construct the full endpoint URL
    const endpoint = `${instanceUrl}/services/data/${apiVersion}/query?q=${encodedQuery}`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionId}` // Use the session ID as a Bearer token
            }
        });

        if (!response.ok) {
            // Handle HTTP error responses (e.g., 401, 403, 404)
            const errorBody = await response.json();
            throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorBody[0]?.message || ''}`);
        }

        const data = await response.json();
        console.log('Query Results:', data.records);
        return data.records; // Returns an array of records
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Example usage:
// A common pattern in Visualforce pages is to use a merge field for the session ID:
// const mySessionId = '{!$Api.Session_ID}'; 

// Example call (replace placeholders):
// fetchSOQLData('YOUR_SESSION_ID', 'SELECT Id, Name FROM Account LIMIT 5')
//     .then(records => {
//         // Process the records
//     });


```

```js

// url: https://infa.my.salesforce.com/services/data/v53.0/query?q=SELECT%20Secure_Agent__c%2C%20Org_POD_Location__c%2C%20Subject%2C%20Description%2C%20Org_ID__c%2COrg_Formula_Id__c%2CCase_Number__c%2Cowner.email%2CLastModifiedBy.Manager.Email%20FROM%20Case%20WHERE%20Id%20%3D%20'500VM00000oKqgnYAC'
const instanceUrl = 'https://infa.my.salesforce.com'; 
const apiVersion = 'v53.0'; // e.g., v61.0


// Encode the SOQL query for safe URL transmission
const sessionId = '00D41000000dqX7!AQEAQGnn3wSMeOXxKa5BXIlPPmSCL7NuMjgoL_QYlswDJQUAxCv4qLifPWAs10lbatxE96qVSpYzSTcad22ITyvSYMZE0awo';
// const soqlQuery = "SELECT Secure_Agent__c, Org_POD_Location__c, Subject, Description, Org_ID__c,Org_Formula_Id__c,Case_Number__c,owner.email,LastModifiedBy.Manager.Email FROM Case WHERE Id = '500VM00000oKqgnYAC'";
const soqlQuery = "SELECT Secure_Agent__c, Org_POD_Location__c, Subject, Description, Org_ID__c,Org_Formula_Id__c,Case_Number__c,owner.email,LastModifiedBy.Manager.Email FROM Case WHERE Id = '500VM00000oKqgnYAC'";
const encodedQuery = encodeURIComponent(soqlQuery);

// Construct the full endpoint URL
const endpoint = `${instanceUrl}/services/data/${apiVersion}/query?q=${encodedQuery}`;

try {
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionId}` // Use the session ID as a Bearer token
        }
    });

    if (!response.ok) {
        // Handle HTTP error responses (e.g., 401, 403, 404)
        const errorBody = await response.json();
        throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorBody[0]?.message || ''}`);
    }

    const data = await response.json();
    console.log('Query Results:', data.records);
    // return data.records; // Returns an array of records
} catch (error) {
    console.error('Error fetching data:', error);
    throw error;
}
```