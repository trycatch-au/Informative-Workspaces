environmentTemplates = {

wrapper :   "<div class=\"section environments central-tech\">" +
                "<h1>Environments</h1>" +
                "<div id=\"build_status\">" +
                    "<div id=\"online_status\">" +
                        "<div id=\"online_status_inner\" class=\"\">" +
                            "<div id=\"online_status_table\" class=\"clear\">" +
                            "</div>" +
                            "<div id=\"online_status_list\" class=\"clear\">" +
                            "</div>" +
                        "</div> <!-- //#online_status_inner -->" +
                    "</div> <!-- //#online_status -->" +
                "</div> <!-- //#build_status -->" +
                "<div class=\"clear\"></div>" +
            "</div>",

environmentsTable:  "<table class=\"environmentsTable\">" + 
                       "<tbody>" +
                       
"<* for (var comp in components) { *>" +


    "<* var compname = components[comp].name;*>"+
    "<* var lastBuildState = '';*>"+
    "<* var buildStatus = '';*>"+
    "<* var building = '';*>"+
//        "<* if (components[comp].lastBuildState.building) { lastBuildState = \"building\" } else if (components[comp].lastBuildState.state === 'STATE_SUCCESS') { lastBuildState = \"success\" } else { lastBuildState = \"failed\" } *>" + 
        "<* if (lastBuildState === 'building') { buildStatus = '<code class=\"building\">building<span>&nbsp;</span></code>'; }*>" + 
        "<* if (lastBuildState === 'failed') { buildStatus = '<code class=\"failed css3-blink\"><span>&nbsp;</span>failed</code>'; }*>" + 

                            "<tr>"+
                                "<td class=\"leader <*=lastBuildState*>\"><*=compname*> <*=buildStatus*></td>" +

    "<* for (var chan in channels) { *>" +
        "<* var channel = chan; *>" +

        "<* var coreClassName = \"non_core\";*>" +
        "<* var versionClassName = \"no_version\"; *>" +
        "<* var channelClassName = \"empty\"; *>" +
        "<* var version = 'n/a';*>" +
        "<* var latest = 'n/a';*>" +
        "<* var hasData = false;*>" +
        "<* if (channels[chan]) { coreClassName = \"core \" + channels[chan]['classes']; } *>" +

        "<* for (var compChannels in components[comp]['channels']) { *>" +
            "<* var current = components[comp]['channels'][compChannels].version; *>" +

            "<* if (components[comp]['channels'][compChannels].channel.name === chan) { *>"+
                "<* hasData = true;*>"+ 

                "<* channelClassName = components[comp]['channels'][compChannels].channel.name; *>" +
                "<* var latest = components[comp].version; *>" +
                "<* version = components[comp]['channels'][compChannels].version; *>"+ 

                "<* if (parseInt(version.substring(0, version.indexOf('.'))) < parseInt(latest.substring(0, latest.indexOf('.')))) { *>" +
                    "<* versionClassName = \"very_old_version\"; *>" +
                "<* } else if  (current < latest ) { *>" +
                    "<* versionClassName = \"old_version\"; *>" +
                "<* } else {*> " +
                    "<* versionClassName = \"current_version\"; *>" +
                "<* } *> " +
            "<* } *>" +
        "<* } *>" +  // end (var compChannels in components[comp]['channels']) 

        "<td class=\"<*=versionClassName*> <*=coreClassName*> <*=channelClassName*>\"><*=version*></td>" +

    "<* } *>" + // end (var chan in channels) 
                        "</tr>"+ 
"<* } *>" + // end (var comp in components) 
                       "</tbody>" +
                       "<thead>" +
                            "<tr>" +
                                "<td class=\"leader\">Component</td>" +
                                "<* for (var chan in channels) { *>" +
                                "<td class=\"<* if (channels[chan]) { *>core <* } *><*=chan*>\"><*=chan*></td>" +
                                "<* } *>" +
                            "</tr>"+
                       "</thead>" +
                       "<tfoot>" + 
                       "</tfoot>" +                       
                   "</table>",

environmentsList:   "<ul id=\"environments\" class=\"environments\">" +
                        "<li class=\"leader\">Component</li>" +
                        "<* for (var data in channels) { *>" +
                            "<li><*=data*></li>" +
                        "<* } *>" +
                    "</ul>",

environmentsList2: "<* for (var comp in components) { *>" +
    "<* var compname = components[comp].name;*>"+
    "<* var lastBuildState = '';*>"+
    "<* var buildStatus = '';*>"+
    "<* var building = '';*>"+
//        "<* if (components[comp].lastBuildState.building) { lastBuildState = \"building\" } else if (components[comp].lastBuildState.state === 'STATE_SUCCESS') { lastBuildState = \"success\" } else { lastBuildState = \"failed\" } *>" + 
  //      "<* if (lastBuildState === 'building') { buildStatus = '<code class=\"building\">building<span>&nbsp;</span></code>'; }*>" + 
        "<* if (lastBuildState === 'failed') { buildStatus = '<code class=\"failed css3-blink\"><span>&nbsp;</span>failed</code>'; }*>" + 

    "<ul id=\"environment_fatwire_<*=compname*>\" class=\"channel\">" +
        "<li class=\"leader <*=lastBuildState*>\"><div><*=compname*></div></li>" +

    "<* for (var chan in channels) { *>" +
        "<* var channel = chan; *>" +

        "<* var coreClassName = \"non_core\";*>" +
        "<* var versionClassName = \"no_version\"; *>" +
        "<* var channelClassName = \"empty\"; *>" +
        "<* var version = 'n/a';*>" +
        "<* var latest = 'n/a';*>" +
        "<* var hasData = false;*>" +
        "<* if (channels[chan]) { coreClassName = \"core \" + channels[chan]['classes']; } *>" +

        "<* for (var compChannels in components[comp]['channels']) { *>" +
            "<* var current = components[comp]['channels'][compChannels].version; *>" +

            "<* if (components[comp]['channels'][compChannels].channel.name === chan) { *>"+
                "<* hasData = true;*>"+ 

                "<* channelClassName = components[comp]['channels'][compChannels].channel.name; *>" +
                "<* var latest = components[comp].version; *>" +
                "<* version = components[comp]['channels'][compChannels].version; *>"+ 

                "<* if (parseInt(version.substring(0, version.indexOf('.'))) < parseInt(latest.substring(0, latest.indexOf('.')))) { *>" +
                    "<* versionClassName = \"very_old_version\"; *>" +
                "<* } else if  (current < latest ) { *>" +
                    "<* versionClassName = \"old_version\"; *>" +
                "<* } else {*> " +
                    "<* versionClassName = \"current_version\"; *>" +
                "<* } *> " +
            "<* } *>" +
        "<* } *>" +  // end (var compChannels in components[comp]['channels']) 

        "<li class=\"<*=versionClassName*> <*=coreClassName*> <*=channelClassName*>\"><*=version*></li>" +

    "<* } *>" + // end (var chan in channels) 
    "</ul>" +
"<* } *>",

    noEnvironments: "<div class=\"error\">Error: no build data to show.</div>"
}
