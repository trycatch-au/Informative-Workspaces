$(function() { 

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'http://10.68.203.229:8085/api/rest/latest/result/FATWIREIT-FATWIREINTEGRATIONTEST10-206.json',
        data: {"os_username" : "admin", "os_password" : "password", "os_authType" : "basic"},
        success: (function(data) { console.log(data);}),
        error: (function(data) {console.log(data);})//,
//        contentType: "application/json; charset=utf-8",
  //      dataType: 'json'
    });
/*    var jqxhr = $.ajax({
        type: 'POST',
        url: 'http://dashboard.news.com.au/rest/auth/latest/session',
        data: {"username" : "admin", "password" : "password"},
        success: (function(data) { console.log('woo');}),
        error: (function(data) {console.log('aww');}),
        contentType: "application/json; charset=utf-8",
        dataType: 'json'
    }); */
});


/*
 *
 *         "bamboo" : {
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
        */
