dashTemplates = {

bambooInfo: 
        "<* for (var comp in components) { *>" +
            "<div class=\"build_element\">" + 
                "<div class=\"component_name\">" +
                    "<*= components[comp].name *>" +
                "</div>"+
                "<div class=\"component_details build_status <*=components[comp].lastBuildState*> rounded-corners\">" +
                    "<dl>" +
                        "<dt>Version</dt>" + 
                        "<dd><*=components[comp].version*></dd>"+
                        "<dt>Build Date</dt>" +
                        "<dd><*=components[comp].lastBuildDate*></dd>" +
                    "</dl>" +
                "</div>"+
            "</div>" +
        "<* } *>",
environmentsTable:  "<table class=\"environmentsTable\">" + 
                       "<tbody>" +

"<* for (var comp in components) { *>" +
    "<* var compname = components[comp].name;*>"+

                            "<tr>"+
                                "<td class=\"leader\"><*=compname*></td>" +

    "<* for (var chan in channels) { *>" +
        "<* var channel = channels[chan].name; *>" +

        "<* var coreClassName = \"non_core\";*>" +
        "<* var versionClassName = \"no_version\"; *>" +
        "<* var channelClassName = \"empty\"; *>" +
        "<* var version = 'n/a';*>" +
        "<* var hasData = false;*>" +

        "<* if (coreEnvironments[channel]) { coreClassName = \"core \" + coreEnvironments[channel]['classes']; } *>" +

        "<* for (var compChannels in components[comp]['channels']) { *>" +
            "<* var current = components[comp]['channels'][compChannels].version; *>" +

            "<* if (components[comp]['channels'][compChannels].channel.name === channels[chan].name) { *>"+
                "<* hasData = true;*>"+ 

                "<* channelClassName = components[comp]['channels'][compChannels].channel.name; *>" +
                "<* var latest = components[comp].version; *>" +
                "<* version = components[comp]['channels'][compChannels].version; *>"+ 

                "<* if (current.substring(0, current.indexOf('.')) > latest.substring(0, latest.indexOf('.'))) { *>" +
                    "<* versionClassName = \"very_old_version\"; *>" +
                "<* } else if  (current > latest ) { *>" +
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
                                    "<* var channel = channels[chan].name; *>" +
                                "<td class=\"<* if (coreEnvironments[channel]) { *>core <* } *><*=channel*>\"><*=channel*></td>" +
                                "<* } *>" +
                            "</tr>"+
                       "</thead>" +
                       "<tfoot>" + 
                       "</tfoot>" +                       
                   "</table>",
    environmentsList: "<ul id=\"environments\" class=\"environments\">" +
                        "<li class=\"leader\">Component</li>" +
                        "<* for (var data in channels) { *>" +
                        "<li><*=channels[data].name*></li>" +
                        "<* } *>" +
                      "</ul>",
    environmentInfo: "<* for (var comp in components) { *>" +
                    "<ul id=\"environment_fatwire_<*= components[comp].name *>\" class=\"channel\">" +
                        "<li class=\"leader\"><*= components[comp].name*></li>" +
                        "<* for (var chan in channels) { *>" +
                            "<* var hasData = false;*>"+
                            "<li class=\"" +
                            "<* for (var compChannels in components[comp]['channels']) { *>" +
                                "<* if (components[comp]['channels'][compChannels].channel.name === channels[chan].name) { *>"+
                                    "<* var current=components[comp]['channels'][compChannels].version; *>" +
                                    "<* var latest=components[comp].version; *>" +
                                    "<* hasData = true;*>"+
                                    " <* if (current.substring(0, current.indexOf('.')) < latest.substring(0, latest.indexOf('.'))) { *>very_old_version <* } else if  (current < latest ) { *> old_version <*} else {*> current_version <* }*>\" ><*= components[comp]['channels'][compChannels].version *>" +
                                "<* } *>" +
                            "<* } *>" +
                                "<* if (!hasData) {*>empty\">&nbsp;<*}*>" +
                                "</li>" +
                        "<* } *>" +
                        "</ul>" + 
                        "<* } *>", 
    latestVersions: "<span>Latest available component versions:</span>" +
                        "<dl>" +
                        "<* for (var comp in components) { *>" +
                            "<dt><*= components[comp].name *>:</dt>" +
                            "<dd><*= components[comp].version *></dd>" +
                        "<* } *>" +
                            "</dl>",

    noEnvironments: "<div class=\"error\"><* if (channels['error']) {*><*= channels['error'] *><*} else {*><*= components['error']*><* }*></div>",
    rotateIndicator: "<div class=\"rotate_navigation\">" + 
                            "<* for (var n=0; n < numRotateGroups; n++) {*><span class=\"environment_rotate rotate_count_<*=n*>\">&bull;</span><*}*>" +
                    "</div>"        
    }
