dashTemplates = {
environmentsTable:  "<table class=\"environmentsTable\">" + 
                       "<tbody>" +
                       
"<* for (var comp in components) { *>" +
    "<* var compname = components[comp].name;*>"+
    "<* var lastBuildState = '';*>"+
    "<* var buildStatus = '';*>"+
    "<* var building = '';*>"+
        "<* if (components[comp].lastBuildState.building) { lastBuildState = \"building\" } else if (components[comp].lastBuildState.state === 'STATE_SUCCESS') { lastBuildState = \"success\" } else { lastBuildState = \"failed\" } *>" + 
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
        "<* if (coreEnvironments[chan]) { coreClassName = \"core \" + coreEnvironments[chan]['classes']; } *>" +

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
                                "<td class=\"<* if (coreEnvironments[chan]) { *>core <* } *><*=chan*>\"><*=chan*></td>" +
                                "<* } *>" +
                            "</tr>"+
                       "</thead>" +
                       "<tfoot>" + 
                       "</tfoot>" +                       
                   "</table>",
issuesTable: "<table class=\"issues_table\" cellspacing=\"3\">" + 
                "<tbody>" + 
                    "<* for (var issue in issues) { *>" +
                    "<tr>" + 
                        "<td class=\"priority p<*= issues[issue].priority*>\"><*= issues[issue].priority*></td>" +
                        "<td class=\"issue_number\"><*= issues[issue].id *></td>" +
                        "<td class=\"issue_description\"><*= issues[issue].name *></td>" +
                        "<td class=\"issue_assigned\"><* if (issues[issue].assigned) { *>#<* } *></td>" +
                    "</tr>" +
                    "<* } *>" +
                "</tbody>" +
                "<thead>" +
                    "<tr>" +
                        "<td colspan=\"4\" class=\"alpha30\">"+
                            "<div class=\"openIssues\">" +
                            "<div class=\"issuesCount\"><*=issues.length*> Open Issues </div>" +
                                "<div class=\"issuesPriorityWrapper\">" +
                            "<* for (var n in issuesMeta.priority) { *>" +
                                "<div class=\"priority round-corners5 <*=n*>\"><*=issuesMeta.priority[n]*></div>" +
                            "<* } *>" +                          
                                "</div>" +
                            "</div>" +
                            "<div class=\"hoursIssues\"><*=issuesMeta.avg*> Hours Open (Avg.) </div>" +
                        "</td>" +
                    "</tr>" +
                "</thead>" +
            "</table>",
environmentsList2: "<* for (var comp in components) { *>" +
    "<* var compname = components[comp].name;*>"+
    "<* var lastBuildState = '';*>"+
    "<* var buildStatus = '';*>"+
    "<* var building = '';*>"+
        "<* if (components[comp].lastBuildState.building) { lastBuildState = \"building\" } else if (components[comp].lastBuildState.state === 'STATE_SUCCESS') { lastBuildState = \"success\" } else { lastBuildState = \"failed\" } *>" + 
        "<* if (lastBuildState === 'building') { buildStatus = '<code class=\"building\">building<span>&nbsp;</span></code>'; }*>" + 
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
        "<* if (coreEnvironments[chan]) { coreClassName = \"core \" + coreEnvironments[chan]['classes']; } *>" +

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
    environmentsList: "<ul id=\"environments\" class=\"environments\">" +
                        "<li class=\"leader\">Component</li>" +
                        "<* for (var data in channels) { *>" +
                        "<li><*=data*></li>" +
                        "<* } *>" +
                      "</ul>",
    noEnvironments: "<div class=\"error\">Unable to connect to API server. No Data available from Build Server</div>",
    }
