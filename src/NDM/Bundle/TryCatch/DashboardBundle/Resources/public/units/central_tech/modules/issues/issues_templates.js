issuesTemplates = {
wrapper:    "<div class=\"section incidents sm7 central-tech\">" +
                            "<h1>Incidents &mdash; Central Tech</h1>" +
                            "<div id=\"tables\">" +
                            "</div>" +
                            "<div id=\"graphs\">" +
                                "<div id=\"call_stats\" class=\"\">" +
                                    "<h2 class=\"graph graph_heading\"><*= graphTitle*></h2>" +
                                    "<div id=\"open_issues\">" +
                                    "</div>" +
                                "</div> <!-- //#call_stats -->" +
                            "</div>" +
                            "<div class=\"clear\"></div>" +
                        "</div>", 
issuesTable: "<table class=\"issues_table\" cellspacing=\"3\">" + 
                "<tbody>" + 
                    "<* for (var issue in issues) { *>" +
                    "<tr>" + 
                        "<td class=\"priority p<*= issues[issue].priority*>\"><*= issues[issue].priority*></td>" +
                        "<td class=\"issue_number\"><*= issues[issue].uid *></td>" +
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
    noIssues: "<div class=\"error\">Error: no SM7 data to show. </div>",
    }
