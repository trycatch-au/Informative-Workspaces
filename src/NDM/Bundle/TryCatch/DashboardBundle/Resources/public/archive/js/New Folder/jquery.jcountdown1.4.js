/* 
* jCountdown 1.4 jQuery Plugin
* Copyright 2011 Tom Ellis http://www.webmuse.co.uk | MIT Licensed (license.txt)
*/
(function($) {
$.fn.countdown = function( method /*, options*/ ) {

	var defaults = {
			date: null,
			updateTime: 1E3,
			htmlTemplate: "%d <span class='cd-time'>days</span> %h <span class='cd-time'>hours</span> %i <span class='cd-time'>mins</span> %s <span class='cd-time'>sec</span>",
			minus: false,
			onChange: null,
			onComplete: null,
			onResume: null,
			onPause: null,
			leadingZero: false,
			offset: null,
			servertime:null,
			hoursOnly: false,
			hours: false,
			yearsAndMonths: false,
			direction: "down"
		},
		slice = [].slice,
		clear = window.clearInterval,
		floor = Math.floor,
		msPerHr = 36E5,
		msPerDay = 864E5,
		rDate = /(%y|%m|%d|%h|%i|%s)/g,
		rYears = /%y/,
		rMonths = /%m/,
		rDays = /%d/,
		rHrs = /%h/,
		rMins = /%i/,
		rSecs = /%s/,
		getTZDate = function( offset, difference ) {					
			
			var hrs,
				dateMS,
				extra,
				tmpDate = new Date();
			
			if( offset === null ) {
				dateMS = tmpDate.getTime() - difference;
			} else {				
				hrs = offset * msPerHr;
				curHrs = tmpDate.getTime() - ( ( -tmpDate.getTimezoneOffset() / 60 ) * msPerHr ) + hrs,
				dateMS = tmpDate.setTime( curHrs );
			}
			return new Date( dateMS );
		},			
		timerFunc = function() {
			//Function runs at set interval updating countdown
			var $this = this,
				template,
				now,
				date,
				timeLeft,
				yearsLeft,
				monthsLeft,
				eDaysLeft,
				daysLeft,
				eHrsLeft,
				hrsLeft,
				minsLeft,					
				eMinsleft,
				secLeft,
				time = "",
				diff,
				settings = $this.data("jcdData");
				
			if( !settings ) {
				return false;
			}
			
			template = settings.htmlTemplate;
			
			if( settings.offset === null && settings.servertime === null ) {
				now = new Date();
			} else 	if( settings.offset !== null ) {
				now = getTZDate( settings.offset );
			} else {
				now =  getTZDate( null, settings.difference ); //Date now
			}
			
			date = new Date( settings.date ); //Date to countdown to
			
			timeLeft = ( settings.direction === "down" ) ? date.getTime() - now.getTime() : now.getTime() - date.getTime();	
			
			diff = Math.floor( timeLeft / 1000 );
			
			secLeft = diff % 60;
			diff = Math.floor( diff / 60 );
			minsLeft = diff % 60;
			diff = Math.floor( diff / 60 );
			hrsLeft = diff % 24;
			
			diff = Math.floor( diff / 24 );
			daysLeft = diff;
						
			if( settings.yearsAndMonths ) {
				yearsLeft = Math.floor( diff / 365 );
				diff = Math.floor( diff % 365 );
				monthsLeft = Math.floor( diff / 30 );
				daysLeft = Math.ceil( diff % 30 ); // Remainder of months left
			}

			if( settings.hoursOnly ) {
				hrsLeft += daysLeft * 24;
				daysLeft = 0;
			}
			
			settings.yearsLeft = yearsLeft,
			settings.monthsLeft = monthsLeft,
			settings.daysLeft = daysLeft;
			settings.hrsLeft = hrsLeft;
			settings.minsLeft = minsLeft;
			settings.secLeft = secLeft;
			
			if( secLeft == 60 ) { 
				secLeft = 0;
			}
			
			if ( settings.leadingZero ) {			
				if ( daysLeft < 10 && !settings.hoursOnly ) {
					daysLeft = "0" + daysLeft;
				}

				if ( yearsLeft < 10 ) {
					yearsLeft = "0" + yearsLeft;
				}
				
				if ( monthsLeft < 10 ) {
					monthsLeft = "0" + monthsLeft;
				}
				
				if ( hrsLeft < 10 ) {
					hrsLeft = "0" + hrsLeft;
				}
				if ( minsLeft < 10 ) {
					minsLeft = "0" + minsLeft;
				}
				if ( secLeft < 10 ) {
					secLeft = "0" + secLeft;
				}
			}

			if ( ( settings.direction === "down" && ( now <= date || settings.minus ) ) 
				|| ( settings.direction === "up" && ( date <= now || settings.minus )  ) ) {
				time = template.replace( rYears, yearsLeft ).replace( rMonths, monthsLeft );
				time = time.replace( rDays, daysLeft ).replace( rHrs, hrsLeft ).replace( rMins, minsLeft ).replace( rSecs, secLeft );				
			} else {
				time = template.replace( rDate, "00");
				settings.hasCompleted = true;
			}
							
			$this.html( time ).trigger("change.jcdevt", [settings] );
						
			if ( settings.hasCompleted ) {
				$this.trigger("complete.jcdevt");
				clear( settings.timer );
			}
		},			
		methods = {		
			init: function( options ) {
				
				var opts = $.extend( {}, defaults, options ),
					template = opts.htmlTemplate,
					local;
				
				return this.each(function() {
					var $this = $(this),
						settings = {},
						func;

					//If this element already has a countdown timer, just change the settings
					if( $this.data("jcdData") ) {
						$this.countdown("changeSettings", options, true);
						opts = $this.data("jcdData");
					}
					
					if( opts.date === null ) {
						return true;
					}
					
					//Add event handlers where set
					if( opts.onChange ) {
						$this.on("change.jcdevt", opts.onChange );
					}
					
					if( opts.onComplete ) {
						$this.on("complete.jcdevt", opts.onComplete );
					}
					
					if( opts.onPause ) {
						$this.on("pause.jcdevt", opts.onPause );
					}

					if( opts.onResume ) {
						$this.on("resume.jcdevt", opts.onResume );
					}
					
					settings = {
						originalHTML : $this.html(),
						date : opts.date,
						yearsAndMonths: opts.yearsAndMonths,
						hoursOnly : opts.hoursOnly,
						leadingZero : opts.leadingZero,
						updateTime : opts.updateTime,
						direction : opts.direction,
						template : opts.htmlTemplate,
						htmlTemplate : opts.htmlTemplate,
						minus : opts.minus,
						offset : opts.offset,
						servertime: opts.servertime,
						difference: null,
						onChange : opts.onChange,
						onComplete : opts.onComplete,
						onResume : opts.onResume,
						onPause : opts.onPause,
						hasCompleted : false,
						timer : 0	
					};
					
					if( opts.servertime !== null ) {
						local = new Date();
						var tempTime;
						
						tempTime = ( $.isFunction( settings.servertime ) ) ? settings.servertime() : settings.servertime;
						settings.difference = local.getTime() - tempTime;
					}

					func = $.proxy( timerFunc, $this );
					settings.timer = setInterval( func, settings.updateTime );

					$this.data( "jcdData", settings );
					
					func();
				});
			},
			changeSettings: function( options, internal /* used internally */) {
				//Like resume but with resetting/changing options				
				return this.each(function() {
					var $this  = $(this),
						settings,
						func = $.proxy( timerFunc, $this );
						
					if( !$this.data("jcdData") ) {
						return true;
					}
					
					settings = $.extend( {}, $this.data("jcdData"), options );
					
					settings.completed = false;
					//Clear the timer, as it might not be needed
					clear( settings.timer );					
					$this.off(".jcdevt").data("jcdData", settings);	
					
					//As this can be accessed via the init method as well,
					//we need to check how this method is being accessed
					if( !internal ) {
						
						if( settings.onChange ) {
							$this.on("change.jcdevt", settings.onChange);
						}

						if( settings.onComplete ) {
							$this.on("complete.jcdevt", settings.onComplete);
						}
				
						if( settings.onPause ) {
							$this.on("pause.jcdevt", settings.onPause );
						}

						if( settings.onResume ) {
							$this.on("resume.jcdevt", settings.onResume );
						}
				
						settings.timer = setInterval( func, settings.updateTime );
						$this.data("jcdData", settings);
						func(); //Needs to run straight away when changing settings
					}
				});
			},
			resume: function() {			
				//Resumes a countdown timer
				return this.each(function() {
					var $this = $(this),
						settings = $this.data("jcdData"),
						func = $.proxy( timerFunc, $this );
					
					if( !settings ) {
						return true;
					}

					$this.data("jcdData", settings).trigger("resume.jcdevt");
					//We only want to resume a countdown that hasn't finished
					if( !settings.hasCompleted ) {
						settings.timer = setInterval( func, settings.updateTime );						
						func();
					}
				});
			},
			pause: function() {	
				//Pause a countdown timer			
				return this.each(function() {
					var $this = $(this),
						settings = $this.data("jcdData");

					if( !settings ) {
						return true;
					}
					//Clear interval (Will be started on resume)
					clear( settings.timer );
					//Trigger pause event handler
					$this.data("jcdData", settings).trigger("pause.jcdevt");					
				});
			},
			complete: function() {
				return this.each(function() {
					var $this = $(this),
						settings = $this.data("jcdData");

					if( !settings ) {
						return true;
					}
					//Clear timer
					clear( settings.timer );
					settings.hasCompleted = true;
					//Update setting, trigger complete event handler, then unbind all events
					//We don"t delete the settings in case they need to be checked later on
					$this.data("jcdData", settings).trigger("complete.jcdevt").off(".jcdevt");
				});		
			},
			destroy: function() {
				return this.each(function() {
					var $this = $(this),
						settings = $this.data("jcdData");
					
					if( !settings ) {
						return true;
					}
					//Clear timer
					clear( settings.timer );
					//Unbind all events, remove data and put DOM Element back to its original state (HTML wise)
					$this.off(".jcdevt").removeData("jcdData").html( settings.originalHTML );
				});
			},
			getSettings: function( name ) {
				var $this = $(this),
					settings = $this.data("jcdData");
				
				//If an individual setting is required
				if( name && settings ) {
					//If it exists, return it
					if( settings.hasOwnProperty( name ) ) {
						return settings[name];
					}
					return undefined;
				}
				//Return all settings or undefined
				return settings;
			}
		};
	
	if( methods[ method ] ) {
		return methods[ method ].apply( this, slice.call( arguments, 1 ) );
	} else if ( typeof method === "object" || !method ) {
		return methods.init.apply( this, arguments );
	} else {
		$.error("Method "+ method +" does not exist in the jCountdown Plugin");
	}
};

})(jQuery);