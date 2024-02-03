"use strict";
(function () {
	// Global variables
	var userAgent = navigator.userAgent.toLowerCase(),
		$window = $( window ),
		$html = $( "html" ),
		$body = $( "body" ),
		isDesktop = $html.hasClass( "desktop" ),
		isNoviBuilder = false,
		plugins = {
			bootstrapModalDialog:    $( '.modal' ),
			bootstrapTabs:           $( ".tabs-custom" ),
			rdNavbar:                $( ".rd-navbar" ),
			materialParallax:        $( ".parallax-container" ),
			rdMailForm:              $( ".rd-mailform" ),
			rdInputLabel:            $( ".form-label" ),
			regula:                  $( "[data-constraints]" ),
			wow:                     $( ".wow" ),
			owl:                     $( ".owl-carousel" ),
			swiper:                  $( ".swiper-slider" ),
			isotope:                 $( ".isotope" ),
			radio:                   $( "input[type='radio']" ),
			checkbox:                $( "input[type='checkbox']" ),
			customToggle:            $( "[data-custom-toggle]" ),
			counter:                 $( ".counter" ),
			preloader:               $( ".preloader" ),
			captcha:                 $( '.recaptcha' ),
			scroller:                $( ".scroll-wrap" ),
			lightGallery:            $( '[data-lightgallery="group"]' ),
			lightGalleryItem:        $( '[data-lightgallery="item"]' ),
			lightDynamicGalleryItem: $( '[data-lightgallery="dynamic"]' ),
			particlesJs:             $( '#particles-js' )
		};

	// Initialize scripts that require a finished document CLEANED UNLESS SWIPER/FILTER REMOVED
	$( function () {
		isNoviBuilder = window.xMode;


		// Page loader & Page transition NEEDED FOR EVERYTHING
		if ( plugins.preloader.length && !isNoviBuilder ) {
			pageTransition( {
				target:            document.querySelector( '.page' ),
				delay:             100,
				duration:          500,
				classIn:           'fadeIn',
				classOut:          'fadeOut',
				classActive:       'animated',
				conditions:        function ( event, link ) {
					return !/(\#|callto:|tel:|mailto:|:\/\/)/.test( link ) && !event.currentTarget.hasAttribute( 'data-lightgallery' );
				},
				onTransitionStart: function ( options ) {
					setTimeout( function () {
						plugins.preloader.removeClass( 'loaded' );
					}, options.duration * .75 );
				},
				onReady:           function () {
					plugins.preloader.addClass( 'loaded' );
					windowReady = true;
				}
			} );
		}

		/**
		 * @desc Calculate the height of swiper slider basing on data attr
		 * @param {object} object - slider jQuery object
		 * @param {string} attr - attribute name
		 * @return {number} slider height
		 * NEEDED FOR filter
		 */
		function getSwiperHeight ( object, attr ) {
			var val = object.attr( "data-" + attr ),
				dim;

			if ( !val ) {
				return undefined;
			}

			dim = val.match( /(px)|(%)|(vh)|(vw)$/i );

			if ( dim.length ) {
				switch ( dim[ 0 ] ) {
					case "px":
						return parseFloat( val );
					case "vh":
						return $window.height() * (parseFloat( val ) / 100);
					case "vw":
						return $window.width() * (parseFloat( val ) / 100);
					case "%":
						return object.width() * (parseFloat( val ) / 100);
				}
			} else {
				return undefined;
			}
		}

		/**
		 * @desc Toggle swiper videos on active slides
		 * @param {object} swiper - swiper slider
		 * NEEDED FOR SWIPER
		 */
		function toggleSwiperInnerVideos ( swiper ) {
			var prevSlide = $( swiper.slides[ swiper.previousIndex ] ),
				nextSlide = $( swiper.slides[ swiper.activeIndex ] ),
				videos,
				videoItems = prevSlide.find( "video" );

			for ( var i = 0; i < videoItems.length; i++ ) {
				videoItems[ i ].pause();
			}

			videos = nextSlide.find( "video" );
			if ( videos.length ) {
				videos.get( 0 ).play();
			}
		}

		/**
		 * @desc Toggle swiper animations on active slides
		 * @param {object} swiper - swiper slider
		 * NEEDED FOR SWIPER
		 */
		function toggleSwiperCaptionAnimation ( swiper ) {
			var prevSlide = $( swiper.container ).find( "[data-caption-animate]" ),
				nextSlide = $( swiper.slides[ swiper.activeIndex ] ).find( "[data-caption-animate]" ),
				delay,
				duration,
				nextSlideItem,
				prevSlideItem;

			for ( var i = 0; i < prevSlide.length; i++ ) {
				prevSlideItem = $( prevSlide[ i ] );

				prevSlideItem.removeClass( "animated" )
					.removeClass( prevSlideItem.attr( "data-caption-animate" ) )
					.addClass( "not-animated" );
			}


			var tempFunction = function ( nextSlideItem, duration ) {
				return function () {
					nextSlideItem
						.removeClass( "not-animated" )
						.addClass( nextSlideItem.attr( "data-caption-animate" ) )
						.addClass( "animated" );
					if ( duration ) {
						nextSlideItem.css( 'animation-duration', duration + 'ms' );
					}
				};
			};

			for ( var i = 0; i < nextSlide.length; i++ ) {
				nextSlideItem = $( nextSlide[ i ] );
				delay = nextSlideItem.attr( "data-caption-delay" );
				duration = nextSlideItem.attr( 'data-caption-duration' );
				if ( !isNoviBuilder ) {
					if ( delay ) {
						setTimeout( tempFunction( nextSlideItem, duration ), parseInt( delay, 10 ) );
					} else {
						tempFunction( nextSlideItem, duration );
					}

				} else {
					nextSlideItem.removeClass( "not-animated" )
				}
			}
		}

		// RD Navbar NEEDED FOR NAVBAR
		if ( plugins.rdNavbar.length ) {
			var aliaces, i, j, len, value, values, responsiveNavbar;

			aliaces = [ "-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-" ];
			values = [ 0, 576, 768, 992, 1200, 1600 ];
			responsiveNavbar = {};

			for ( i = j = 0, len = values.length; j < len; i = ++j ) {
				value = values[ i ];
				if ( !responsiveNavbar[ values[ i ] ] ) {
					responsiveNavbar[ values[ i ] ] = {};
				}
				if ( plugins.rdNavbar.attr( 'data' + aliaces[ i ] + 'layout' ) ) {
					responsiveNavbar[ values[ i ] ].layout = plugins.rdNavbar.attr( 'data' + aliaces[ i ] + 'layout' );
				}
				if ( plugins.rdNavbar.attr( 'data' + aliaces[ i ] + 'device-layout' ) ) {
					responsiveNavbar[ values[ i ] ][ 'deviceLayout' ] = plugins.rdNavbar.attr( 'data' + aliaces[ i ] + 'device-layout' );
				}
				if ( plugins.rdNavbar.attr( 'data' + aliaces[ i ] + 'hover-on' ) ) {
					responsiveNavbar[ values[ i ] ][ 'focusOnHover' ] = plugins.rdNavbar.attr( 'data' + aliaces[ i ] + 'hover-on' ) === 'true';
				}
				if ( plugins.rdNavbar.attr( 'data' + aliaces[ i ] + 'auto-height' ) ) {
					responsiveNavbar[ values[ i ] ][ 'autoHeight' ] = plugins.rdNavbar.attr( 'data' + aliaces[ i ] + 'auto-height' ) === 'true';
				}

				if ( isNoviBuilder ) {
					responsiveNavbar[ values[ i ] ][ 'stickUp' ] = false;
				} else if ( plugins.rdNavbar.attr( 'data' + aliaces[ i ] + 'stick-up' ) ) {
					responsiveNavbar[ values[ i ] ][ 'stickUp' ] = plugins.rdNavbar.attr( 'data' + aliaces[ i ] + 'stick-up' ) === 'true';
				}

				if ( plugins.rdNavbar.attr( 'data' + aliaces[ i ] + 'stick-up-offset' ) ) {
					responsiveNavbar[ values[ i ] ][ 'stickUpOffset' ] = plugins.rdNavbar.attr( 'data' + aliaces[ i ] + 'stick-up-offset' );
				}
			}


			plugins.rdNavbar.RDNavbar( {
				anchorNav:    !isNoviBuilder,
				stickUpClone: (plugins.rdNavbar.attr( "data-stick-up-clone" ) && !isNoviBuilder) ? plugins.rdNavbar.attr( "data-stick-up-clone" ) === 'true' : false,
				responsive:   responsiveNavbar,
				callbacks:    {
					onStuck:        function () {
						var navbarSearch = this.$element.find( '.rd-search input' );

						if ( navbarSearch ) {
							navbarSearch.val( '' ).trigger( 'propertychange' );
						}
					},
					onDropdownOver: function () {
						return !isNoviBuilder;
					},
					onUnstuck:      function () {
						if ( this.$clone === null )
							return;

						var navbarSearch = this.$clone.find( '.rd-search input' );

						if ( navbarSearch ) {
							navbarSearch.val( '' ).trigger( 'propertychange' );
							navbarSearch.trigger( 'blur' );
						}

					}
				}
			} );


			if ( plugins.rdNavbar.attr( "data-body-class" ) ) {
				document.body.className += ' ' + plugins.rdNavbar.attr( "data-body-class" );
			}
		}

		// Swiper NEEDED FOR SWIPER
		if ( plugins.swiper.length ) {
			for ( var i = 0; i < plugins.swiper.length; i++ ) {
				var s = $( plugins.swiper[ i ] );
				var pag = s.find( ".swiper-pagination" ),
					next = s.find( ".swiper-button-next" ),
					prev = s.find( ".swiper-button-prev" ),
					bar = s.find( ".swiper-scrollbar" ),
					swiperSlide = s.find( ".swiper-slide" ),
					autoplay = false;

				for ( var j = 0; j < swiperSlide.length; j++ ) {
					var $this = $( swiperSlide[ j ] ),
						url;

					if ( url = $this.attr( "data-slide-bg" ) ) {
						$this.css( {
							"background-image": "url(" + url + ")",
							"background-size":  "cover"
						} )
					}
				}

				swiperSlide.end()
					.find( "[data-caption-animate]" )
					.addClass( "not-animated" )
					.end();

				s.swiper( {
					autoplay:                 s.attr( 'data-autoplay' ) ? s.attr( 'data-autoplay' ) === "false" ? undefined : s.attr( 'data-autoplay' ) : 5000,
					direction:                s.attr( 'data-direction' ) && isDesktop ? s.attr( 'data-direction' ) : "horizontal",
					effect:                   s.attr( 'data-slide-effect' ) ? s.attr( 'data-slide-effect' ) : "slide",
					speed:                    s.attr( 'data-slide-speed' ) ? s.attr( 'data-slide-speed' ) : 600,
					keyboardControl:          s.attr( 'data-keyboard' ) === "true",
					mousewheelControl:        s.attr( 'data-mousewheel' ) === "true",
					mousewheelReleaseOnEdges: s.attr( 'data-mousewheel-release' ) === "true",
					nextButton:               next.length ? next.get( 0 ) : null,
					prevButton:               prev.length ? prev.get( 0 ) : null,
					pagination:               pag.length ? pag.get( 0 ) : null,
					paginationClickable:      pag.length ? pag.attr( "data-clickable" ) !== "false" : false,
					paginationBulletRender:   function ( swiper, index, className ) {
						if ( pag.attr( "data-index-bullet" ) === "true" ) {
							return '<span class="' + className + '">' + (index + 1) + '</span>';
						} else if ( pag.attr( "data-bullet-custom" ) === "true" ) {
							return '<span class="' + className + '"><span></span></span>';
						} else {
							return '<span class="' + className + '"></span>';
						}
					},
					scrollbar:                bar.length ? bar.get( 0 ) : null,
					scrollbarDraggable:       bar.length ? bar.attr( "data-draggable" ) !== "false" : true,
					scrollbarHide:            bar.length ? bar.attr( "data-draggable" ) === "false" : false,
					loop:                     isNoviBuilder ? false : s.attr( 'data-loop' ) !== "false",
					simulateTouch:            s.attr( 'data-simulate-touch' ) && !isNoviBuilder ? s.attr( 'data-simulate-touch' ) === "true" : false,
					onTransitionStart:        function ( swiper ) {
						toggleSwiperInnerVideos( swiper );
					},
					onTransitionEnd:          function ( swiper ) {
						toggleSwiperCaptionAnimation( swiper );
					},
					onInit:                   (function ( s ) {
						return function ( swiper ) {
							toggleSwiperInnerVideos( swiper );
							toggleSwiperCaptionAnimation( swiper );

							var $swiper = $( s );

							var swiperCustomIndex = $swiper.find( '.swiper-pagination__fraction-index' ).get( 0 ),
								swiperCustomCount = $swiper.find( '.swiper-pagination__fraction-count' ).get( 0 );

							if ( swiperCustomIndex && swiperCustomCount ) {
								swiperCustomIndex.innerHTML = formatIndex( swiper.realIndex + 1 );
								if ( swiperCustomCount ) {
									if ( isNoviBuilder ? false : s.attr( 'data-loop' ) !== "false" ) {
										swiperCustomCount.innerHTML = formatIndex( swiper.slides.length - 2 );
									} else {
										swiperCustomCount.innerHTML = formatIndex( swiper.slides.length );
									}
								}
							}
						}
					}( s )),
					onSlideChangeStart:       (function ( s ) {
						return function ( swiper ) {
							var swiperCustomIndex = $( s ).find( '.swiper-pagination__fraction-index' ).get( 0 );

							if ( swiperCustomIndex ) {
								swiperCustomIndex.innerHTML = formatIndex( swiper.realIndex + 1 );
							}
						}
					}( s ))
				} );

				$window.on( "resize", (function ( s ) {
					return function () {
						var mh = getSwiperHeight( s, "min-height" ),
							h = getSwiperHeight( s, "height" );
						if ( h ) {
							s.css( "height", mh ? mh > h ? mh : h : h );
						}
					}
				})( s ) ).trigger( "resize" );
			}
		}

		// NEEDED  FOR FILTER
		function formatIndex ( index ) {
			return index < 10 ? '0' + index : index;
		}

		// Isotope NEEDED FOR FILTER
		if ( plugins.isotope.length ) {
			var isogroup = [];
			for ( var i = 0; i < plugins.isotope.length; i++ ) {
				var isotopeItem = plugins.isotope[ i ],
					isotopeInitAttrs = {
						itemSelector: '.isotope-item',
						layoutMode:   isotopeItem.getAttribute( 'data-isotope-layout' ) ? isotopeItem.getAttribute( 'data-isotope-layout' ) : 'masonry',
						filter:       '*'
					};

				if ( isotopeItem.getAttribute( 'data-column-width' ) ) {
					isotopeInitAttrs.masonry = {
						columnWidth: parseFloat( isotopeItem.getAttribute( 'data-column-width' ) )
					};
				} else if ( isotopeItem.getAttribute( 'data-column-class' ) ) {
					isotopeInitAttrs.masonry = {
						columnWidth: isotopeItem.getAttribute( 'data-column-class' )
					};
				}

				var iso = new Isotope( isotopeItem, isotopeInitAttrs );
				isogroup.push( iso );
			}


			setTimeout( function () {
				for ( var i = 0; i < isogroup.length; i++ ) {
					isogroup[ i ].element.className += " isotope--loaded";
					isogroup[ i ].layout();
				}
			}, 200 );

			var resizeTimout;

			$( "[data-isotope-filter]" ).on( "click", function ( e ) {
				e.preventDefault();
				var filter = $( this );
				clearTimeout( resizeTimout );
				filter.parents( ".isotope-filters" ).find( '.active' ).removeClass( "active" );
				filter.addClass( "active" );
				var iso = $( '.isotope[data-isotope-group="' + this.getAttribute( "data-isotope-group" ) + '"]' ),
					isotopeAttrs = {
						itemSelector: '.isotope-item',
						layoutMode:   iso.attr( 'data-isotope-layout' ) ? iso.attr( 'data-isotope-layout' ) : 'masonry',
						filter:       this.getAttribute( "data-isotope-filter" ) === '*' ? '*' : '[data-filter*="' + this.getAttribute( "data-isotope-filter" ) + '"]'
					};
				if ( iso.attr( 'data-column-width' ) ) {
					isotopeAttrs.masonry = {
						columnWidth: parseFloat( iso.attr( 'data-column-width' ) )
					};
				} else if ( iso.attr( 'data-column-class' ) ) {
					isotopeAttrs.masonry = {
						columnWidth: iso.attr( 'data-column-class' )
					};
				}
				iso.isotope( isotopeAttrs );
			} ).eq( 0 ).trigger( "click" )
		}

		// WOW NEEDED FOR MULTIPLE
		if ( $html.hasClass( "wow-animation" ) && plugins.wow.length && !isNoviBuilder && isDesktop ) {
			new WOW().init();
		}

		// Custom Toggles NEEDED FOR FILTER
		if ( plugins.customToggle.length ) {
			for ( var i = 0; i < plugins.customToggle.length; i++ ) {
				var $this = $( plugins.customToggle[ i ] );

				$this.on( 'click', $.proxy( function ( event ) {
					event.preventDefault();

					var $ctx = $( this );
					$( $ctx.attr( 'data-custom-toggle' ) ).add( this ).toggleClass( 'active' );
				}, $this ) );

				if ( $this.attr( "data-custom-toggle-hide-on-blur" ) === "true" ) {
					$body.on( "click", $this, function ( e ) {
						if ( e.target !== e.data[ 0 ]
							&& $( e.data.attr( 'data-custom-toggle' ) ).find( $( e.target ) ).length
							&& e.data.find( $( e.target ) ).length === 0 ) {
							$( e.data.attr( 'data-custom-toggle' ) ).add( e.data[ 0 ] ).removeClass( 'active' );
						}
					} )
				}

				if ( $this.attr( "data-custom-toggle-disable-on-blur" ) === "true" ) {
					$body.on( "click", $this, function ( e ) {
						if ( e.target !== e.data[ 0 ] && $( e.data.attr( 'data-custom-toggle' ) ).find( $( e.target ) ).length === 0 && e.data.find( $( e.target ) ).length === 0 ) {
							$( e.data.attr( 'data-custom-toggle' ) ).add( e.data[ 0 ] ).removeClass( 'active' );
						}
					} )
				}
			}
		}/**
		 * @desc Check if all elements pass validation
		 * @param {object} elements - object of items for validation
		 * @param {object} captcha - captcha object for validation
		 * @return {boolean}
		 */
		function isValidated(elements, captcha) {
			var results, errors = 0;

			if (elements.length) {
				for (var j = 0; j < elements.length; j++) {

					var $input = $(elements[j]);
					if ((results = $input.regula('validate')).length) {
						for (k = 0; k < results.length; k++) {
							errors++;
							$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
						}
					} else {
						$input.siblings(".form-validation").text("").parent().removeClass("has-error")
					}
				}

				if (captcha) {
					if (captcha.length) {
						return validateReCaptcha(captcha) && errors === 0
					}
				}

				return errors === 0;
			}
			return true;
		}

		// particlesJs - NEEDED
		if ( plugins.particlesJs.length ) {
			particlesJS( 'particles-js', {
				"particles":     {
					"number":      {
						"value":   200,
						"density": {
							"enable":     true,
							"value_area": 800
						}
					},
					"color":       {
						"value": "#ffffff"
					},
					"shape":       {
						"type":    "circle",
						"stroke":  {
							"width": 0,
							"color": "#000000"
						},
						"polygon": {
							"nb_sides": 5
						},
						"image":   {
							"src":    "img/github.svg",
							"width":  100,
							"height": 100
						}
					},
					"opacity":     {
						"value":  0.5,
						"random": false,
						"anim":   {
							"enable":      false,
							"speed":       1,
							"opacity_min": 0.1,
							"sync":        false
						}
					},
					"size":        {
						"value":  5,
						"random": true,
						"anim":   {
							"enable":   false,
							"speed":    40,
							"size_min": 0.1,
							"sync":     false
						}
					},
					"line_linked": {
						"enable":   true,
						"distance": 150,
						"color":    "#ffffff",
						"opacity":  0.4,
						"width":    1
					},
					"move":        {
						"enable":    true,
						"speed":     6,
						"direction": "none",
						"random":    true,
						"straight":  false,
						"out_mode":  "out",
						"attract":   {
							"enable":  false,
							"rotateX": 600,
							"rotateY": 1200
						}
					}
				},
				"interactivity": {
					"detect_on": "canvas",
					"events":    {
						"onhover": {
							"enable": true,
							"mode":   "grab"
						},
						"onclick": {
							"enable": true,
							"mode":   "push"
						},
						"resize":  true
					},
					"modes":     {
						"grab":    {
							"distance":    400,
							"line_linked": {
								"opacity": 1
							}
						},
						"bubble":  {
							"distance": 400,
							"size":     40,
							"duration": 2,
							"opacity":  8,
							"speed":    3
						},
						"repulse": {
							"distance": 200
						},
						"push":    {
							"particles_nb": 4
						},
						"remove":  {
							"particles_nb": 2
						}
					}
				},
				"retina_detect": true,
				"config_demo":   {
					"hide_card":           false,
					"background_color":    "#b61924",
					"background_image":    "",
					"background_position": "50% 50%",
					"background_repeat":   "no-repeat",
					"background_size":     "cover"
				}
			} )
		}

	} );
}());