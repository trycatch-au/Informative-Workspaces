var $modules = {
        'releases' : {
            'path' : '', // if we need to make it non-relative (i.e. including a module from another unit
            'name' : 'releases', // the name of the unit. This is used in path building
            'init' : 'releases_init.js', // the init file that will run EVERYTHING for a given module
            'placement' : 'section_1', // where on the main page you'd like it to sit. 
	    'api' : { 
		    'use' : false, // whether to use your defined API. Not really that useful, except for testing when there IS NO API.
		    'server' : ''
	    }
        }, 
        'issues' : {
            'path' : '',
            'name' : 'issues',
            'init' : 'issues_init.js',
            'placement' : 'section_3',
	    'api' : {
		    'use' : false,
		    'server' : ''
	    }
        },
        'environments' : {
            'path' : '',
            'name' : 'environments',
            'init' : 'environment_init.js',
            'placement' : 'section_2',
	    'api' : {
		    'use' : false,
		    'server' : ''
	    } 
        }
    },
    $dash = $dash || window.$dash || $.getUrlVar('dash'), // the defined dash from the query string. Worst case, we get the information afresh.
    $jsPaths = $jsPaths || window.$jsPaths || {},
    $extras = { 
	/* 
		A list of libraries and includes that are required for this dashboard.
		This is NOT the place for generic, over-page related scripts. 
		Just scripts that are used in multiple modules on a defined dashboard
	*/
        'base_path' : $jsPaths.bundlePath + $jsPaths.units + '/' + $dash + '/modules/libraries/',            
        'libraries' : { 
            'bigtext' : 'bigtext.js'
        }
    },
    $module,
    $ex, 
    $mod = { // this will load up the options to be called from Modernizr.
        'load': {},
        'callback' : {},
        'complete' : {}
    }; 

for ($ex in $extras.libraries) {
    if ($extras.libraries.hasOwnProperty($ex)) {
        $mod['load'][$ex] = $extras.base_path + $extras.libraries[$ex];
    }
}

for ($module in $modules) {
    if ($modules.hasOwnProperty($module)) {
        if ($modules[$module].path.length > 0) {
            $mod['load'][$modules[$module].name] =  $modules[$module].path + '/' + $modules[$module].init;
        } else {
            $mod['load'][$modules[$module].name] =  $jsPaths.bundlePath +  $jsPaths['units'] + '/' + $dash + $jsPaths['modules'] + '/' + $modules[$module].path + $modules[$module].name + '/' + $modules[$module].init;
        }
    }
}

Modernizr.load([{
    load: $mod['load']
}]);
