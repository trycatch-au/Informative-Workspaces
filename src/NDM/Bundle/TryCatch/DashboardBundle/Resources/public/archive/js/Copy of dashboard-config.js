var mygetrequest = new ajaxRequest(),
    i, j, 
    url = '',
    data = '',
    api = '',
    auth = '',
    apiObjects = {
        "bamboo" : {
            "protocol" : "http",
            "baseURL" : "10.68.203.229",
            "port" : "8085",
            "path" : "/api/rest/latest/",
            "call" : "result/FATWIREIT-FATWIREINTEGRATIONTEST10-206.json",
            "credentials" : {
                "os_authType" : "basic",
                "os_username" : "admin",
                "os_password" : "password"
            }
        },
        "sonar" : {
            "protocol" : "http",
            "baseURL" : "10.68.203.70",
            "port" : "9000",
            "path" : "/api/",
            "call" : "resources?metrics=ncloc,coverage&format=json"
        },
        "jira" : {
            "protocol" : "http",
            "baseURL" : "dashboard.news.com.au",
            "port" : "8080",
            "path" : "/rest/api/2.0.alpha1/",
            "call" : "issue/CT-503"
        }
    };

function ajaxRequest() {
    var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"]; //activeX versions to check for in IE
    if (window.ActiveXObject) { //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
        for (var i=0; i<activexmodes.length; i++) {
            try {
                return new ActiveXObject(activexmodes[i])
            }
            catch(e) {
                //suppress error
            }
        }
    } else if (window.XMLHttpRequest) { // if Mozilla, Safari etc
        return new XMLHttpRequest()
    } else {
        return false
    }
}

mygetrequest.onreadystatechange = function() {
    if (mygetrequest.readyState == 4) {
        if (mygetrequest.status == 200 || window.location.href.indexOf("http") == -1){
            console.log(mygetrequest.responseText);
            console.log(count);
            document.getElementById('test').innerHTML = mygetrequest.responseText;
        } else {
            console.log("An error has occured making the request. " + mygetrequest.status);
            document.getElementById('test' + count).innerHTML = 'nope';
        }
    }
}

var count = 0;
for (i in apiObjects) { 
    if (apiObjects.hasOwnProperty(i)) {
        api = apiObjects[i];
        if (api.credentials) {
            for (j in api.credentials) {
                if (api.credentials.hasOwnProperty(j)) {
                    auth += "&" + j + "=" + api.credentials[j];
                }
            }
        } else {
            auth = '';
        }
        url = api.protocol + "://" + api.baseURL + ':' + api.port + api.path + api.call + auth;
        console.log(url);
        mygetrequest.open("GET", url, true);
        mygetrequest.send(null);
    }
    count++;
}

//mygetrequest.open("GET", "http://10.68.203.70:9000/api/resources?metrics=ncloc,coverage&format=json", true);
//mygetrequest.send(null);


// sonar
//
// /api/resources?metrics=ncloc,coverage&format=json

//Jira
// http://dashboard.news.com.au:8080/rest/api/2.0.alpha1/issue/CT-503

// Bamboo
// auth: /api/rest/login.action?username=admin&password=password
// data: /api/rest/getLatestBuildResults.action?auth=N9kH7zHu3u&buildKey=NGCMS-CONTENTSERVERPARENT80

