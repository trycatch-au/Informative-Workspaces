releaseTemplates = {
    noInformation:  "<div class=\"error\">Unable to connect to API server.</div><div class=\"error\">No Data regarding Release Dates available.</div>",
    dayLayout:      "<span class=\"days\">{dn}<*=dayVar*></span> <span class=\"sub\"><span class=\"hours\">{hn}hours</span> <span class=\"minutes\">{mn}minutes</span> <span class=\"seconds\">{sn}seconds</span></span>",
    releaseDates:   "<div id=\"prod_release_deadline\" class=\"inset\">" +
                        "<dl id=\"prod_release_deadline\" class=\"\">" +
                            "<dt id=\"prod_release_deadline_label\">In Production</dt>" +
                            "<dd id=\"prod_release_deadline_time\"></dd>" +
                        "</dl>" +
                    "</div> <!-- //prod_release_deadline -->" +
                    "<div id=\"code_deadlines\" class=\"inset\">" +
                        "<dl id=\"svn_build_deadline\" class=\"\">" +
                            "<dt id=\"svn_build_deadline_label\">Final Commit (SVN)</dt>" +
                            "<dd id=\"svn_build_deadline_time\"></dd>" +
                        "</dl>" +
                        "<div  class=\"clear\"></div>" +
                    "</div> <!-- //svn_build_deadline -->",
    wrapper :   "<div class=\"releases\">" +
                    "<h1>Next Release</h1>" +
                    "<div id=\"next_release\">" +
                        "<div id=\"release_information\">" +
                            "<div id=\"release_name\"></div>" +
                        "</div>" +
                        "<div id=\"deadlines\" class=\"alpha30\">" +
                        "</div> <!-- //#deadlines -->" +
                    "</div>" +
                    "<div class=\"clear\"></div>" +
                "</div> "
}
