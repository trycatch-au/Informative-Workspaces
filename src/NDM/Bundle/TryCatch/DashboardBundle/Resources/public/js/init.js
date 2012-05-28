var $jsPaths = {
	'bundlePath' : '/bundles/trycatchdashboard',
        'base' : '/js',
        'units' : '/units',
        'modules' : '/modules'           
    }, 
    $dash;

/* Below are some generic utility scripts that are useful for the dashboard as a whole. 
 * They don't necessarily belong to any particular section of the dashboard, and they might not be used at all
 */

$.extend({ // get all the Query String params as associative array.
    getUrlVars: function(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function(name){
        return $.getUrlVars()[name];
    }
});

if (typeof console === "undefined") {
    // kill the console under unsupported browsers
    window.console = {
        log: function () {}
    };
}

function jsonpCallback(data){
    console.log("jsonpCallback");
}


if (typeof Date === "function") {
    /* the data that comes from the API is a date format that is incompatible with a lot of 
     * built in date parsers.
     * This replaces the dashes with a forward slash that seems to work globally 
     * For some reason, globally overriding the Date object is seen as a bad idea :P
     */
    Date.prototype.convertedDashDate =  
        function (dateString) {
            return new Date(dateString.replace(/-/g, '/'));
        }
}

(function() {
    $dash = $.getUrlVar('dash');
	$(document).ready(function() {
	    if (!$dash) { 
		$('header').empty().removeClass('inactive').addClass('active emergency').html('<div class="round-corners10 alpha60_white"><h1>No Dashboard</h1><p>You must define a dashboard before using this website.<p><p>To learn how to create a dashboard, please see the help documentation located at [TODO].</p><p>To define a dashboard to use, please add a query parameter of "dash=[dashboard_name]" after the URL.</p></div> ');
	    } else {
		Modernizr.load({
			load: {
				'init' : $jsPaths.bundlePath + $jsPaths.units  + '/' +  $dash + '/init.js'
			},
			callback : { 
				'init' : function(url, result, key) {
//						var $moduleName = $moduleName;
//						if (!$moduleName) {
//							console.log('invalid dashboard', url, result, key);
//						}
					} 
			},
			complete : function(url, result, key) {
//				console.log('test: ', url, result, key);
//				if (!$moduleName) {
//					console.log('invalid dashboard', url, result, key);
//				}
			}
		});
//		'units/' + $dash + '/init.js');
	    }
	});
})();
