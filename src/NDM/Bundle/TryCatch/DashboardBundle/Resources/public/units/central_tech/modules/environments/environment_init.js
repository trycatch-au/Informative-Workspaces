(function() {
    var dataSources = {
            "components"    : "http://informative.news.newslimited.local/api/components.js"
        },
        $moduleName = "environments",
        $modules = $modules || window.$modules || {},
        $dash = $dash || $.getUrlVar('dash'),
        $jsPaths = $jsPaths || window.$jsPaths || {},
        envListMarkup, envTableMarkup, envInfoMarkup, envErrorMarkup,
        useApi = window.$modules[$moduleName].api.use || true,
        ajaxDataType = 'jsonp',
        coreEnvironments = {
            "dev": {
                "longName"  : "User Acceptance Testing",
                "classes"   : "latest truth first build"
            },
            "SIT1": {
                "longName"  : "SIT Environment 1",
                "classes"   : ""
            },
            "SIT2": {
                "longName"  : "SIT Environment 2",
                "classes"   : ""
            },
            "PC-UAT": {
                "longName"  : "Paid Content Test Environment",
                "classes"   : ""
            },
            "PROD" : {
                "longName"  : "Production",
                "classes"   : "prod"
            }            
        },
        $envLeader, $envItems, envMarkup, sysMarkup, $envNames;

    if (!useApi) {
        dataSources.components = 'fake_data/components.js';
        ajaxDataType = 'json';
    }

    window.jsonPTest = function (data) {
	    return data;
    }

    Modernizr.load({
        load: {
            'css': $jsPaths.bundlePath + $jsPaths.units + '/' + $dash + $jsPaths.modules + '/' + $moduleName + '/central-tech_environment.css',
            'templates' : $jsPaths.bundlePath + $jsPaths.units + '/' + $dash + $jsPaths.modules + '/' + $moduleName + '/environment_templates.js' 
            },
        callback : {
            'css' : function() {},
            'templates' : function() {
                envWrapperMarkup = tmpl(environmentTemplates.wrapper, {});
                $('#' + $modules[$moduleName].placement).addClass('active').append(envWrapperMarkup);
                $.ajax({
                    url: dataSources.components,
		    dataType: ajaxDataType,
		    jsonp: "_callback",
                    type: "GET",
                    success : function (data) {
                        envTableMarkup = tmpl(environmentTemplates.environmentsTable, {'components' : data, 'channels': coreEnvironments});
                        envListMarkup = tmpl(environmentTemplates.environmentsList, {'components' : data, 'channels': coreEnvironments});
                        envInfoMarkup = tmpl(environmentTemplates.environmentsList2, {'components' : data, 'channels': coreEnvironments});
                    },
                    error: function (one, two, three) {
                        envErrorMarkup = tmpl(environmentTemplates.noEnvironments, {});
                    },
                    complete: function () {
                        if (envErrorMarkup) {
                            $('#online_status_table').css({'width': '90%', 'color': '#fff', 'margin' : '50px 0', 'padding' : '0 4%'}).append(envErrorMarkup).bigtext();
                        } else {
                            $('#online_status_list').append(envListMarkup);
                            $('#online_status_list').append(envInfoMarkup);
                            $('#online_status_table').append(envTableMarkup);
                            $('#online_status_table table tr:nth-child(odd), ul.environments li:nth-child(even), ul.channel li:nth-child(even)').addClass('alpha30');
                            $envLeader = $('#online_status ul.environments').clone().removeAttr('id').addClass('cloned');
                    $envItems = $('#online_status ul:not(.environments)');
                    $envItems.filter(':even:not(:first)').before($envLeader);
                        }
                    }
                });                           
            }
        }         
    });
 
})();
