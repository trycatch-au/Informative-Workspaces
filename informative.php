<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title>&nbsp;</title>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
	<script src="/assets/js/jquery.curvycorners.packed.js"></script>
	<script src="http://code.highcharts.com/highcharts.js"></script>
	<script src="http://code.highcharts.com/modules/exporting.js"></script>
	<script src="/assets/js/jquery_countdown.js"></script>

	<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/3.4.1/build/cssreset/cssreset-min.css">
	<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/3.4.1/build/cssgrids/grids-min.css">
	<link media="all" rel="stylesheet" type="text/css" href="/assets/css/webfonts.css" />
	<link media="all" rel="stylesheet" type="text/css" href="/assets/css/base.css" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>


<script type="text/JavaScript">

  $(function(){ 
  
	  settings = {
	          tl: { radius: 10 },
	          tr: { radius: 10 },
	          bl: { radius: 10 },
	          br: { radius: 10 },
	          autoPad: true,
	          validTags: ["div"]
	      }

	  $('.digital_clock_medium').corner(settings);
	  $('.digital_clock_large').corner(settings);
	  $('.graph_container').corner(settings);
	  
	  $('a.remove').click(function(){
			$('.digital_clock_medium').removeCorners();
	  });
	  $('a.redraw').click(function(){
	  		$('.digital_clock_medium').redrawCorners();
	  });
	  
	  });

	$(function () {
		var prodRelease = new Date(); 
		prodRelease = new Date("April 29, 2012 01:45:00"); 
		$('#releaseCountdown').countdown({until: prodRelease, format: 'HMS', layout: '{hnn}hrs {mnn}mins {snn}secs'}); 

		var codeFreeze = new Date(); 
		codeFreeze = new Date("April 20, 2012 17:00:38"); 
		$('#codeFreezeCountdown').countdown({until: codeFreeze, format: 'HMS', layout: '{hnn}hrs {mnn}mins {snn}secs'}); 
	
var 	prodReleaseDays = new Date(); 
		prodReleaseDays = new Date("April 29, 2012 01:00:00"); 
		$('#releaseCountdownDays').countdown({until: prodReleaseDays, layout: '{dn}DAYS'}); 
	});


  $(function () {
    var chart;
    $(document).ready(function() {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                backgroundColor: '#1e1e1e',
                type: 'line'
            },
            title: {
                text: null
            },
            xAxis: {
				lineColor: '#464646',
            	lineWidth: 1,
            	gridLineColor: '#464646',
                categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            },

            yAxis: {
				lineColor: '#464646',
            	lineWidth: 1,
            	gridLineColor: '#464646',
                min: 0,
                title: {
                    text: null,
                    style: {
                        fontWeight: 'bold',
                        color: '#464646'
                    }
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: '#464646'
                    }
                }
            },

            navigation: {
	            buttonOptions: {
	                enabled: false
	            }
	        },

            plotOptions: {

			series: {
                marker: {
                    radius: 9
                }
            },

                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black'
                    }
                }
            },
            series: [{
                name: 'P1',
                data: [1, 0, 0, 0, 2, 0, 0],
                lineWidth: 11,
                color: 'ff2600'
            }, {
                name: 'P2',
                data: [0, 0, 1, 2, 0, 0, 0],
                lineWidth: 11,
                color: 'ff8148'
            }, {
                name: 'P3',
                data: [3, 2, 5, 2, 1, 2, 1],
                lineWidth: 11,
                color: '1a74a9'
            }, {
                name: 'P4',
                data: [0, 0, 1, 0, 0, 0, 0],
                lineWidth: 11,
                color: '84c5eb'
            }]
        });
    });
    
});

</script>


</head>
<body id="doc">
<div class="yui3-g" style="height: 100%">
        <div id="screen_left" class="yui3-u-1-2">
        	<img src="/assets/images/promo_1_top.gif">
        	<img src="/assets/images/promo_1_middle.gif">
        	<img src="/assets/images/promo_1_bottom.gif">
        </div>
        <div id="screen_right" class="yui3-u-1-2">
        	<div class="yui3-g">
				<div id="release_version" class="yui3-u-2-3">
					<h1>12R2</h1>
				</div>
				<div id="countdown_days" class="yui3-u-1-3 digital_clock_large"><div id="releaseCountdownDays"></div></div>		
			</div>	

        	<div class="yui3-u-1-1">
				<div id="deadline_countdown_block" class="digital_clock_medium">
					<table>
						<thead>
							<th width="480">Description</th>
							<th width="480">Deadline</th>
						</thead>
						<tr>
							<td>SVN (Final Commit)</td>
							<td><div id="codeFreezeCountdown"></div></td>
						</tr>
						<tr>
							<td>PROD (Release)</td>
							<td><div id="releaseCountdown"></div></td>
						</tr>
					</table>
				</div>
        	</div> 

        	<div class="yui3-u-1-1">
				<div id="env_version_block" class="digital_clock_medium">
					<table>
						<thead>
							<th width="480">Component</th>
							<th width="160">DEV</th>
							<th width="160">SIT1</th>
							<th width="160">UAT1</th>
							<th width="160">PROD</th>
						</thead>
						<tr>
							<td>FATWIRE</td>
							<td>10.0</td>
							<td>9.0.18</td>
							<td>9.0.18</td>
							<td>9.0.16</td>
						</tr>
						<tr>
							<td>CAM</td>
							<td>9.0.24</td>
							<td>9.0.23</td>
							<td>9.0.23</td>
							<td>9.0.16</td>
						</tr>
					</table>	
				</div>
        	</div>

        	<div class="yui3-u-1-1">
				<div id="env_version_block" class="graph_container">
					<div id="container" style="min-width: 400px; height: 400px; margin: 0 auto"></div>	
				</div>
        	</div>

        </div>
    </div>
</body>


<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-30677569-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>




</html>