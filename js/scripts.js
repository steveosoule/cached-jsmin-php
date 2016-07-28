var cornerstoneUX = {
	init: function () {
		String.prototype.toCamelCase = function(cap1st) {
			return ((cap1st ? '-' : '') + this).replace(/-+([^-])/g, function(a, b) {
				return b.toUpperCase();
			});
		};
		var pageID = document.body.id.toCamelCase();

		if (cornerstoneUX[pageID]) {
			// ---- If the function exists, run it, otherwise, don't do anything. ---- //
			$(document).ready(function () {
				cornerstoneUX[pageID]();
			});
		}

		$(document).ready(function () {
			// ---- Create the "main" element for older versions of IE ---- //
			document.createElement('main');

			$('.js-hide').hide();
			$('.js-show').show();
			$('.js-remove').remove();
			$('select, :text, textarea').not('.input').addClass('input');
			cornerstoneUX.sharedFunctions.toggle();
			cornerstoneUX.sharedFunctions.showHide();
			cornerstoneUX.sharedFunctions.tabs();

			$('.js-slide-toggle').on('click', function (e) {
				e.preventDefault();

				var $trigger = $(this),
					$target = $($trigger.data('target'));

				$target.slideToggle('fast');

			});

			// ---- Allow Named Anchors With A Class Of "smoothscroll" To Work Without Full URL ---- //
			$('a[href^="\#"].smoothscroll').on('click', function (e) {
				e.preventDefault();
				var selector = this.href.substr(this.href.indexOf('#')),
					target = $(selector),
					offset = 10;

				if (target.offset().top > windowHeight / 2) {
					offset = $('#js-header').outerHeight();
				}

				scrollToDiv(target, offset);
			});

			// ---- Quantity Incrementer ---- //
			$('#js-increase-quantity, .js-increase-quantity').on('click', function () {
				var $qty = $(this).parent().prev(),
					currentVal = parseInt($qty.val()),
					$update = $(this).parent().siblings('.js-update-quantity');

				if (!isNaN(currentVal)) {
					$qty.val(currentVal + 1).change();
					$update.trigger('click');
				}
			});
			$('#js-decrease-quantity, .js-decrease-quantity').on('click', function () {
				var $qty = $(this).parent().prev(),
					currentVal = parseInt($qty.val()),
					min = (!isNaN($qty.data('min'))) ? $qty.data('min') : 1,
					$update = $(this).parent().siblings('.js-update-quantity');

				if (!isNaN(currentVal) && currentVal > min) {
					$qty.val(currentVal - 1).change();
					$update.trigger('click');
				}
			});

			$('.js-read-more').readmore({
				speed: 75,
				moreLink: '<a href="#" class="js-read-more-toggle read-more-toggle">... read more</a>',
				lessLink: '<a href="#" class="js-read-more-toggle read-less-toggle">read less</a>',
				collapsedHeight: 67,
				embedCSS: false
			});

			// ---- Sticky ---- //
			function stickyHeader() {
				// Main Header & Stick Header
				var jsHeader = $('#js-header'),
					stickyNav = $('#js-sticky-header'),
					jsHHeight = $(jsHeader).height(),
					sNHeight = $(stickyNav).height(),
					jsMain = $('main');
				// Copying of the Logo & dropdown menu
				var allCategoriesNav = $('#js-all-categories-nav').clone();
				$(allCategoriesNav).attr('id', 'js-sticky-categories-nav');

				$('#js-sticky-dropdown-button .dropdown-menu-sticky-wrap').html( allCategoriesNav );
				$(window).scroll(function () {
					if ( $(this).scrollTop() >= jsHHeight) {
						$(stickyNav).addClass('slideDownSticky');
						$(jsHeader).addClass('sticky-shown');
						$(jsMain).addClass('sticky-is-shown');
					} else if ( $(stickyNav).hasClass('slideDownSticky') ) {
						$(stickyNav).removeClass('slideDownSticky');
						$(jsHeader).removeClass('sticky-shown');
						$(jsMain).removeClass('sticky-is-shown');
					}
				});
			}
			//stickyHeader();

			(function floatingPlaceholder(){
				function updateText(event){
					var $input = $(this);

					setTimeout(function(){
						if( $input.val() !== '' || $input.is(':focus') || $input.prop('tagName') === 'SELECT' ) {
							$input.parent().addClass('floating-placeholder-float');
						} else {
							$input.parent().removeClass('floating-placeholder-float');
						}
					}, 1);
				}
				$('.floating-placeholder .input').each(updateText);
				$('.floating-placeholder .input, .floating-placeholder select').on('input keyup change blur', updateText);
			})();

			(function(){
				var autocomplete = {
					$inputs: $('.js-autocomplete-input'),
					$results: $('.js-autocomplete-results'),
					init: function(){
						autocomplete.$inputs.on('input', autocomplete.getResults);
						autocomplete.$inputs.on('blur', autocomplete.hideResults);
						// TODO: Add keyboard controls
					},
					getResults: debounce(function(e) {
						var $input = $(this),
							search = $.trim($input.val());

						if( !search.length ) return;

						$.get(
							$input.data('api-url'),
							{
								Get: 'autocomplete',
								Search: search
							},
							autocomplete.displayResults
						);
					}, 150),
					displayResults: function(response){
						if( !$.trim(response) ){
							autocomplete.$results.hide();
							return;
						}
						autocomplete.$results.html(response);
						autocomplete.$results.fadeIn(100);
					},
					hideResults: debounce(function(){
						autocomplete.$results.fadeOut(100);
					}, 750)
				};
				autocomplete.init();
			})();

			// ---- Back to Top Controls ---- //
			(function backToTop () {
				if ($(window).innerWidth() < 768) {
					return;
				}

				var chaser = $('#js-chaser'),
					windowHeight = $(window).height();

				if (chaser) {
					$(window).scroll(function() {
						if ($(window).scrollTop() >= windowHeight / 2) {
							chaser.fadeIn();
						}
						else {
							chaser.hide();
						}
					});

					chaser.on('click', function () {
						$('html, body').animate({scrollTop: '0px'}, 800);
					});
				}
			})();

			// ---- On scroll, fix the header to the top ---- //
			// if (document.location.protocol !== 'https:' && $(window).innerWidth() > 768) {
			// 	$('#js-header').stuck();
			// }

			// ---- Toggle global search display ---- //
			$('#js-open-global-search, #js-open-global-search--tablet').on('click', function (e) {
				e.preventDefault();
				$(this).toggleClass('bg-gray');
				$('#js-global-search').fadeToggle();
			});

			// ---- Mobile Footer Links Control ---- //
			function footerNavControl () {
				/* Corrects positioning of virtual keyboard */
				$(document).on('focus', 'input, select, textarea', function () {
					$('#mobile-footer').hide();
				});
				$(document).on('blur', 'input, select, textarea', function () {
					$('#mobile-footer').show();
				});
			}
			$(window).on('debouncedresize load', footerNavControl ());

		});

		$('.js-az-menu-trigger').on('click', function(e){
			e.preventDefault();
			$('.nav-group-2').toggle();
			if( !$('.nav-group-2').is(':visible') ){
				$('.nav-group-3, .nav-group-4').hide();
			}
		});

		$('.js-az-menu-trigger, #js-sticky-dropdown-button .button').on('mouseenter', function(){
			$('.nav-group-2').show();
		});

		var timer;
		$('.js-az-menu-trigger, #js-sticky-dropdown-button .button, .nav-group-2, .nav-group-3, .nav-group-4').on({
			mouseover: function(){
				clearTimeout(timer);
			},
			mouseout: function(e){
				clearTimeout(timer);
				timer = setTimeout(function(){
					$('.nav-group-2, .nav-group-3, .nav-group-4').hide();
				}, 250);
			}
		});

		$('.nav-group-2 a').on('mouseenter', function() {
			$('.nav-group-3').css('min-height', $(this).parent().height());
		});

		$.getScript(theme_path + '/js/jquery.menu-aim.js', function(data, textStatus) {
			$('.nav-group-2').menuAim({
				 activate: function(row) {
				 	var $item = $(row),
				 		id = $item.data('navigationitem-id'),
						$group = $('.nav-group-4[data-navigationitem-id="' + id + '"]');

					$('.nav-group-4').hide();
					if( $group.find('.nav-group-5').length ){
						$group.show();
						$('.nav-group-3').show();
					}
				 },
				 deactivate: function(row) {
				 	$('.nav-group-4').hide();
				 	$('.nav-group-3').hide();
				 },
				 rowSelector: ".nav-item-2"
			 });
		});

		// ---- Mobile Footer Links Control ---- //
		function mobileFooterToggles(h5) {
			if ( $(window).width() <= 768 ) {
				if ( $(h5).parent().find('.mobile-toggle').is(':visible') ) {
					$(h5).find('span').attr('data-icon', 'L');
				} else {
					$(h5).find('span').attr('data-icon', 'K');
				}
				$(h5).parent().find('.mobile-toggle').slideToggle();
			}
		}
		$('footer h5').on('click', function(e) {
			mobileFooterToggles($(this));
		});
	},
	sharedFunctions: {
		// ---- Product Carousels ---- //
		productsCarousels: function (carousel, append) {
			var carousel = $(carousel);
			if (append === true) {
				var appendArrowsTo = $(carousel.selector).parent();
			}
			else if (append === 'undefined') {
				var appendArrowsTo = $(carousel.selector);
			}

			$.getScript(theme_path + '/js/jquery.slick.min.js', function () {
				carousel.slick({
					appendArrows: appendArrowsTo,
					draggable: false,
					slidesToScroll: 3,
					slidesToShow: 3,
					responsive: [
						{
							breakpoint: 960,
							settings: {
								slidesToScroll: 2,
								slidesToShow: 2
							}
						},
						{
							breakpoint: 767,
							settings: {
								slidesToScroll: 1,
								slidesToShow: 1
							}
						}
					]
				});
			});
		},
		// ---- Cart Summary Controls ---- //
		cartSummary: function () {
			var marker = $('#js-toggle-cart-summary-contents').find('span'),
				clickCount = 0;

			$('#js-toggle-cart-summary-contents').on('click', function (e) {
				e.preventDefault();
				if (clickCount) {
					marker.html('&#9660;');
					clickCount = 0;
					$('#js-cart-summary-contents').slideDown();
				}
				else {
					clickCount = 1;
					marker.html('&#9658;');
					$('#js-cart-summary-contents').slideUp();
				}
			});
			if ($(window).innerWidth() < 768) {
				$('#js-toggle-cart-summary-contents').click();
			}
		},

		// ---- Open Forgot Password ---- //
		openForgotPassword: function (pageID) {
			$('#js-open-forgot-password').magnificPopup({
				callbacks: {
					open: function () {
						if (pageID === 'jsOCST') {
							// magnificPopup.close();
						}
					}
				},
				focus: '#l-Customer_LoginEmail',
				items: {
					src: $('#js-forgot-password'),
					type: 'inline'
				}
			});
		},

		// ---- Conform all subcategory and/or product DIVs to same height ---- //
		conformDisplay: function (selector) {
			var targetElement = selector || '.category-product';

			$(window).on('load', function () {
				$(targetElement).conformity({mode: 'height'});
			});
			$(window).on('resize', function () {
				$(targetElement).conformity({mode: 'height'});
			});
		},

		// ---- Open Product Image Gallery ---- //
		productGallery: function (trigger) {
			trigger.on('click', function (e) {
				var startAt = Number($(this).attr('data-index'));

				e.preventDefault();
				if (gallery.length > 0) {
					$.magnificPopup.open({
						callbacks: {
							open: function () {
								$.magnificPopup.instance.goTo(startAt);
							}
						},
						gallery: {
							enabled: true
						},
						items: gallery,
						type: 'image'
					});
				}
				else {
					$.magnificPopup.open({
						items: {
							src: $('#js-main-image').attr('data-image')
						},
						type: 'image'
					});
				}
			});
		},

		// ---- Quick View Function ---- //
		openQuickView: function () {
			$('.quick-view, .js-quick-view').on('click', function (e){
				var productLink = $(this).data('product-link');

				e.preventDefault();
				$.magnificPopup.open({
					items: {
						src: productLink
					},
					type: 'iframe'
				});
			});
		},

		// ---- Miva Google Address Autocomplete ---- //
		/*mvGAAC: {
			init: function(){
				var self = this;
				$('.js-geocomplete-input').removeAttr('placeholder');
				$(window).on('load', function(){
					$('.js-geocomplete-input').removeAttr('placeholder');
				});
				$.getScript('//cdnjs.cloudflare.com/ajax/libs/geocomplete/1.6.5/jquery.geocomplete.min.js', cornerstoneUX.sharedFunctions.mvGAAC.loaded);
			},
			loaded: function(){
				$('.js-geocomplete-input')
					.geocomplete()
					.bind('geocode:result', cornerstoneUX.sharedFunctions.mvGAAC.result);
			},
			result: function(event, result){
				var $input = $(this),
					$container = $input.closest('.js-geocomplete-container'),
					streetNumber = '',
					streetName = '',
					country = '',
					address = '';

				result.address_components.reverse();

				$.each(result.address_components, function(index, component){
					var component_type = component.types[0];

					switch (component_type){
						case 'street_number':
							streetNumber = component.long_name;
							address = streetNumber;
							if( streetName ){
								address += ' ' + streetName;
							}
							$container.find('[name$="Address1"], [name$="_addr"]').val(address).trigger('input');
							break;
						case 'route':
							streetName = component.long_name;
							address = '';
							if(streetNumber){
								address = streetNumber + ' ' + streetName;
							}
							$container.find('[name$="Address1"], [name$="_addr"]').val(address).trigger('input');
							break;
						case 'locality':
							$container.find('[name$="City"], [name$="_city"]').val(component.long_name).trigger('input');
							break;
						case 'administrative_area_level_1':
							if( country === 'US' ){
								$container.find('[name$="StateSelect"], [name$="_state"]').val(component.short_name).trigger('input');
							} else {
								$container.find('[name$="State"]').val(component.short_name).trigger('input');
							}
							break;
						case 'country':
							country = component.short_name;
							$container.find('[name$="Country"], [name$="_cntry"]').val(component.short_name).trigger('change');
							break;
						case 'postal_code':
							$container.find('[name$="Zip"], [name$="_zip"]').val(component.long_name).trigger('input');
							break;
						default:
							break;
					}
				});
			}
		},*/
		toggle: function(){
			$('[data-toggle]').each(function(){
				var $trigger = $(this),
					target = $trigger.data('toggle'),
					$target = $(target);
				$trigger.prepend('<span data-icon="&#x4c;"></span>&nbsp;&nbsp;&nbsp;');
				if( $target.is(':visible') ){
					$trigger.addClass('active');
				}
			});
			$('[data-toggle]').on('click', function(e){
				e.preventDefault();
				var $trigger = $(this),
					target = $trigger.data('toggle'),
					$target = $(target);

				if( $target.is(':visible') ){
					$target.slideUp('fast');
					$trigger.find('[data-icon]').replaceWith('<span data-icon="&#x4c;"></span>');
					$trigger.removeClass('active');
				} else {
					$target.slideDown('fast');
					$trigger.find('[data-icon]').replaceWith('<span data-icon="&#x4b;"></span>');
					$trigger.addClass('active');
				}
			});
		},
		showHide: function(){
			$('[data-show]').on('click', function(){
				var $this = $(this);
				$($this.data('show')).show();
			});
			$('[data-hide]').on('click', function(){
				var $this = $(this);
				$($this.data('hide')).hide();
			});
		},
		tabs: function(){
			$('.js-tabs').each(function(){
				var $container = $(this);
				$container.find('.js-tab').first().addClass('tab-active');
				$container.find('.js-tab-item:gt(0)').hide();
			});
			$('.js-tabs').on('click', '.js-tab', function(e){
				e.preventDefault();
				var $tab = $(this),
					index = $tab.index(),
					$container = $tab.closest('.js-tabs'),
					$tabItem = $container.find('.tab-item:eq(' + index + '), .js-tab-item:eq(' + index + ')');

				if( $tabItem.is(':visible') ){
					return false;
				}

				$container.find('.tab-active').removeClass('tab-active');
				$container.find('.tab-item, .js-tab-item').fadeOut(200);
				$tabItem.fadeIn(200);
				$tab.addClass('tab-active');
			});
		}
	},

	jsSFNT: function () {
		// ---- Product Carousel ---- //
		cornerstoneUX.sharedFunctions.productsCarousels('#js-whats-popular-carousel');

		// ---- Open Quick View ---- //
		cornerstoneUX.sharedFunctions.openQuickView();
		function minFeaturedProductsHeight() {
			var minHeight = $('#js-featured-products-height').outerHeight();
			$('.js-featured-products-height-min').css('min-height', minHeight);
		}
		minFeaturedProductsHeight();
		$(window).on('resize', minFeaturedProductsHeight);

	},

	jsCTGY: function () {
		// ---- Conform all subcategory and/or product DIVs to same height ---- //
		cornerstoneUX.sharedFunctions.conformDisplay();
		cornerstoneUX.sharedFunctions.conformDisplay('.sub-category');

		// ---- Open Quick View ---- //
		cornerstoneUX.sharedFunctions.openQuickView();
	},

	jsPROD: function () {
		// ---- Open Product Image Gallery ---- //
		cornerstoneUX.sharedFunctions.productGallery($('#js-main-image-zoom'));

		var mainImageZoom = $('#js-main-image-zoom'),
			thumbnails = $('#js-thumbnails');

		thumbnails.on('click', 'div', function () {
			var thumbnailIndex = $(this).attr('data-index');
			mainImageZoom.attr('data-index', thumbnailIndex);
			var clickedLI = parseFloat($(this).attr('data-index'));
			if ( thumbnailIndex ) {
				$('#js-main-dots li.active').removeClass('active');
				$('#js-main-dots li[data-index="' + thumbnailIndex + '"]').addClass('active');
			}
		});

		var debouncedThumbnailSlider = debounce(function(){
			$('#js-thumbnails').unslick().slick({
				vertical: true,
				draggable: false,
				slidesToScroll: 1,
				slidesToShow: 4
			});
		}, 100);

		$.getScript(theme_path + '/js/jquery.slick.min.js', debouncedThumbnailSlider);
		$(window).resize(debouncedThumbnailSlider);

		// ---- Update Button For "Out Of Stock" ---- //
		function outOfStock () {
			var button = $('#js-add-to-cart'),
				buttonText = button.val();

			if (button.is(':disabled') === true) {
				button.addClass('bg-gray').val('Sold Out');
			}
			else {
				button.removeClass('bg-gray').val(buttonText);
			}
		}
		outOfStock();

		// ---- Set Initial Swatch Name ---- //
		$('#js-swatch-name').text($('#js-swatch-select').find('option:first-child').text());

		// ---- Add Border to Active Swatch ---- //
		function selectedSwatch () {
			$('#js-swatches').find('li').each(function () {
				var swatchElement = $(this),
					swatchColor = swatchElement.attr('data-code');

				swatchElement.removeClass('selected-swatch');
				if (swatchColor === $('#js-swatch-select').find('option:selected').val() ) {
					swatchElement.addClass('selected-swatch');
					// swatchColor = swatchColor.replace(/ /g,'');
					// swatchColor = swatchColor.toLowerCase();

					// var namedColors = {
					// 	aliceblue: 'f0f8ff',antiquewhite: 'faebd7',aqua: '00ffff',aquamarine: '7fffd4',azure: 'f0ffff',beige: 'f5f5dc',bisque: 'ffe4c4',black: '000000',blanchedalmond: 'ffebcd',blue: '0000ff',blueviolet: '8a2be2',brown: 'a52a2a',burlywood: 'deb887',cadetblue: '5f9ea0',chartreuse: '7fff00',chocolate: 'd2691e',coral: 'ff7f50',cornflowerblue: '6495ed',cornsilk: 'fff8dc',crimson: 'dc143c',cyan: '00ffff',darkblue: '00008b',darkcyan: '008b8b',darkgoldenrod: 'b8860b',darkgray: 'a9a9a9',darkgreen: '006400',darkkhaki: 'bdb76b',darkmagenta: '8b008b',darkolivegreen: '556b2f',darkorange: 'ff8c00',darkorchid: '9932cc',darkred: '8b0000',darksalmon: 'e9967a',darkseagreen: '8fbc8f',darkslateblue: '483d8b',darkslategray: '2f4f4f',darkturquoise: '00ced1',darkviolet: '9400d3',deeppink: 'ff1493',deepskyblue: '00bfff',dimgray: '696969',dodgerblue: '1e90ff',feldspar: 'd19275',firebrick: 'b22222',floralwhite: 'fffaf0',forestgreen: '228b22',fuchsia: 'ff00ff',gainsboro: 'dcdcdc',ghostwhite: 'f8f8ff',gold: 'ffd700',goldenrod: 'daa520',gray: '808080',green: '008000',greenyellow: 'adff2f',honeydew: 'f0fff0',hotpink: 'ff69b4',indianred : 'cd5c5c',indigo : '4b0082',ivory: 'fffff0',khaki: 'f0e68c',lavender: 'e6e6fa',lavenderblush: 'fff0f5',lawngreen: '7cfc00',lemonchiffon: 'fffacd',lightblue: 'add8e6',lightcoral: 'f08080',lightcyan: 'e0ffff',lightgoldenrodyellow: 'fafad2',lightgrey: 'd3d3d3',lightgreen: '90ee90',lightpink: 'ffb6c1',lightsalmon: 'ffa07a',lightseagreen: '20b2aa',lightskyblue: '87cefa',lightslateblue: '8470ff',lightslategray: '778899',lightsteelblue: 'b0c4de',lightyellow: 'ffffe0',lime: '00ff00',limegreen: '32cd32',linen: 'faf0e6',magenta: 'ff00ff',maroon: '800000',mediumaquamarine: '66cdaa',mediumblue: '0000cd',mediumorchid: 'ba55d3',mediumpurple: '9370d8',mediumseagreen: '3cb371',mediumslateblue: '7b68ee',mediumspringgreen: '00fa9a',mediumturquoise: '48d1cc',mediumvioletred: 'c71585',midnightblue: '191970',mintcream: 'f5fffa',mistyrose: 'ffe4e1',moccasin: 'ffe4b5',navajowhite: 'ffdead',navy: '000080',oldlace: 'fdf5e6',olive: '808000',olivedrab: '6b8e23',orange: 'ffa500',orangered: 'ff4500',orchid: 'da70d6',palegoldenrod: 'eee8aa',palegreen: '98fb98',paleturquoise: 'afeeee',palevioletred: 'd87093',papayawhip: 'ffefd5',peachpuff: 'ffdab9',peru: 'cd853f',pink: 'ffc0cb',plum: 'dda0dd',powderblue: 'b0e0e6',purple: '800080',red: 'ff0000',rosybrown: 'bc8f8f',royalblue: '4169e1',saddlebrown: '8b4513',salmon: 'fa8072',sandybrown: 'f4a460',seagreen: '2e8b57',seashell: 'fff5ee',sienna: 'a0522d',silver: 'c0c0c0',skyblue: '87ceeb',slateblue: '6a5acd',slategray: '708090',snow: 'fffafa',springgreen: '00ff7f',steelblue: '4682b4',tan: 'd2b48c',teal: '008080',thistle: 'd8bfd8',tomato: 'ff6347',turquoise: '40e0d0',violet: 'ee82ee',violetred: 'd02090',wheat: 'f5deb3',white: 'ffffff',whitesmoke: 'f5f5f5',yellow: 'ffff00',yellowgreen: '9acd32'
					// };
					// for (var key in namedColors) {
					// 	if (swatchColor === key) {
					// 		swatchElement.css('border-color', '#' + namedColors[key]);
					// 	}
					// 	else {
					// 		swatchElement.addClass('selected-swatch');
					// 	}
					// }
				}
			});
		}
		selectedSwatch();

		// ---- Update Display When Attribute Machine Fires ---- //
		MivaEvents.SubscribeToEvent('variant_changed', function () {
			gallery.length = 0;
			mainImageZoom.attr('data-index', 0);
			thumbnailIndex = 0;
			outOfStock();
			selectedSwatch();
			debouncedThumbnailSlider();
		});

		document.addEventListener('ImageMachine_Generate_Thumbnail', function(e) {
			debouncedThumbnailSlider();
		}, false);

		// ---- Update Display Price Based on Attribute Selections (If Attribute Machine Is Not Being Used) ---- //
		if (typeof attrMachCall === 'undefined' && document.getElementById('js-product-attribute-count').value > 0) {
			for(var baseProductPrice=Number(document.getElementById("js-price-value").getAttribute("data-base-price")),regularProductPrice=Number(),productAttributeCount=Number(document.getElementById("js-product-attribute-count").value+1),productAttributes=document.getElementById("js-purchase-product").elements,attributeType=[""],i=0;i<productAttributes.length;i++){var tagName=productAttributes[i].tagName.toLowerCase(),elementType=productAttributes[i].type,type=productAttributes[i].getAttribute("data-attribute-type"), name=productAttributes[i].name;"hidden"==elementType&&null!=type&&attributeType.push(type);productAttributes[i].onchange=function(){updateProductDisplayPrice()}} function updateProductDisplayPrice(){for(var b,a,c=baseProductPrice,f=regularProductPrice,d=1;d<productAttributeCount;d++)if(b=document.getElementsByName("Product_Attributes["+d+"]:value"),"select"==attributeType[d])for(var e=0;e<b.length;e++)a=b.item(e),a=a.options.item(a.selectedIndex),c+=Number(a.getAttribute("data-option-price")),f+=Number(a.getAttribute("data-regular-price"));else if("radio"==attributeType[d]||"checkbox"==attributeType[d])for(e=0;e<b.length;e++)a=b.item(e),a.checked&&(c+=Number(a.getAttribute("data-option-price")), f+=Number(a.getAttribute("data-regular-price")));else if("text"==attributeType[d]||"memo"==attributeType[d])a=b.item(0),a.value&&(c+=Number(a.getAttribute("data-option-price")),f+=Number(a.getAttribute("data-regular-price")));b=document.getElementsByName("Quantity");c*=Number(b.item(0).value);b.item(0);document.getElementById("js-price-value").innerHTML=formatCurrency(c);document.getElementById("js-mobile-price-value")&&(document.getElementById("js-mobile-price-value").innerHTML=formatCurrency(c))} function formatCurrency(b){var a=!1;0>b&&(a=!0,b=Math.abs(b));return(a?"-$":"$")+parseFloat(b,10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g,"$1,").toString()}updateProductDisplayPrice();
		}

		// ---- AJAX Add To Cart ---- //
		function addToCart () {
			$('#js-add-to-cart').on('click', function (e) {
				var purchaseForm = $('#js-purchase-product');
				// Check the form is not currently submitting
				if (purchaseForm.data('formstatus') !== 'submitting') {
					// Set up variables
					var form = purchaseForm,
						formData = form.serialize(),
						formUrl = form.attr('action').replace('^https?:', ''),
						formMethod = form.attr('method'),
						responseMessage = $('#js-purchase-message'),
						miniBasket = $('#js-mini-basket-container'),
						processingImage = $('#js-processing-purchase'),
						purchaseButton = $(this),
						purchaseButtonText = purchaseButton.val();

					// Add status data to form
					form.data('formstatus', 'submitting');

					// Show processing message
					processingImage.show();
					purchaseButton.toggleDisabled().val('Processing...');
					responseMessage.html('').hide();

					// Send data to server for validation
					$.ajax({
						url: formUrl,
						type: formMethod,
						cache: false,
						data: formData,
						success: function(data, textStatus, jqXHR) {
							if (data.search(/id="js-BASK"/i) != -1) {
								$('html, body').animate({scrollTop: '0px'}, 250);
								var responseMiniBasket = $(data).find('#js-mini-basket-container'),
									miniBasketCount = responseMiniBasket.contents()[1].getAttribute('data-itemcount'),
									miniBasketSubtotal = ' ' + responseMiniBasket.contents()[1].getAttribute('data-subtotal'),
									miniBasketLinkCount = $('#js-mini-basket-count, #js-mobile-basket-button .notification'),
									miniBasketLinkSubtotal = $('#js-mini-basket-subtotal');

								miniBasketLinkCount.text(miniBasketCount); // Update basket quantity (display only)
								miniBasketLinkSubtotal.text(miniBasketSubtotal); // Update basket subtotal (display only)

								miniBasket.html(responseMiniBasket.contents()).addClass('open');
								setTimeout(function () {
									miniBasket.removeClass('open');
								}, 5000);

								// Re-Initialize Attribute Machine (if it is active)
								if (typeof attrMachCall !== 'undefined') {
									attrMachCall.Initialize();
								}
							}
							else if(data.search(/id="js-PATR"/i) != -1) {
								var missingAttrs = [];
								form.find('.required').each(function () {
									missingAttrs.push(' ' + $(this).attr('title'));
								});
								responseMessage.html('All <em class="red">Required</em> options have not been selected.<br />Please review the following options: <span class="red">' + missingAttrs + '</span>.').fadeIn().delay(5000).fadeOut();
							}
							else if(data.search(/id="js-PLMT"/i) != -1) {
								responseMessage.html('We do not have enough of the Size/Color you have selected.<br />Please adjust your quantity.').fadeIn().delay(3000).fadeOut();
							}
							else if(data.search(/id="js-POUT"/i) != -1) {
								responseMessage.html('The Size/Color you have selected is out of stock.<br />Please review your options or check back later.').fadeIn().delay(3000).fadeOut();
							}
							else {
								responseMessage.html('Please review options.').fadeIn().delay(3000).fadeOut();
							}

							// Hide processing message and reset formstatus
							processingImage.hide();
							purchaseButton.toggleDisabled().val(purchaseButtonText);
							form.data('formstatus', 'idle');
						},
						error: function (jqXHR, textStatus, errorThrown) {
						}
					});
				}
				// Prevent form from submitting
				e.preventDefault();
			});
		}
		addToCart();

		// ---- Related Products Carousel ---- //
		$.getScript(theme_path + '/js/jquery.slick.min.js', function () {
			$('#js-related-products-carousel').slick({
				draggable: false,
				slidesToScroll: 2,
				slidesToShow: 2,
			});
		});

		// --- Mobile slider for Images --- //
		function mobileImageSlider() {
			var totalThumbs = parseFloat($('#js-thumbnails .thumbnail-img-wrap').length - 1 ),
				currentImg = parseFloat($('#js-main-image-zoom').attr('data-index'));

				if (totalThumbs === -1 ) {
					$('.main-image-nav').hide();
				} else {
					$('#js-main-dots').html('');
					$('#js-main-dots').html('<ul class="inline-list np"></ul>');
					for (var i = totalThumbs; i >= 0; i--) {
						if (i > 0){
							$('#js-main-dots ul').prepend('<li data-index="' + i + '"></li>');
						} else {
							$('#js-main-dots ul').prepend('<li class="active" data-index="' + i + '"></li>');
						}
					}
				}


			$('#js-main-dots ul li').on('click', function() {
				var clickedLI = parseFloat($(this).attr('data-index'));
				$('#js-thumbnails .thumbnail-img-wrap[data-index="' + clickedLI + '"]').click();
				$('#js-main-dots ul li.active').removeClass('active');
				$(this).addClass('active');
				currentImg = clickedLI;
			});

			function nextMobileImage() {
				var currIndex = parseFloat($('#js-main-image-zoom').attr('data-index')),
					nextImage = $('#js-main-dots li[data-index="' + (currIndex + 1) + '"]'),
					firstImage = $('#js-main-dots li[data-index="0"]');
				if ($(nextImage).length > 0) {
					$(nextImage).click();
				} else {
					$(firstImage).click();
				}
			}

			function prevMobileImage() {
				var currIndex = parseFloat($('#js-main-image-zoom').attr('data-index')),
					prevImage = $('#js-main-dots li[data-index="' + (currIndex - 1) + '"]'),
					lastImage = $('#js-main-dots li[data-index="' + totalThumbs + '"]');
				if ($(prevImage).length > 0) {
					$(prevImage).click();
				} else {
					$(lastImage).click();
				}

			}
			if (totalThumbs > 1 ) {
				$("#js-main-image-zoom").swipe( {
					swipeLeft:function(event, direction, distance, duration, fingerCount) {
						nextMobileImage();
					},
					swipeRight:function(event, direction, distance, duration, fingerCount) {
						prevMobileImage();
					},
					threshold:10
				});
			}
		}
		mobileImageSlider();

	},

	jsPLST: function () {
		// ---- Conform all subcategory and/or product DIVs to same height ---- //
		cornerstoneUX.sharedFunctions.conformDisplay();

		// ---- Open Quick View ---- //
		cornerstoneUX.sharedFunctions.openQuickView();
	},

	jsSRCH: function () {
		// ---- Conform all subcategory and/or product DIVs to same height ---- //
		cornerstoneUX.sharedFunctions.conformDisplay();

		// ---- Open Quick View ---- //
		cornerstoneUX.sharedFunctions.openQuickView();
	},

	jsBASK: function () {
		// ---- Remove Item From Basket (Compatible down to IE6) ---- //
		$('.remove-item').on('click', function () {
			$(this).children('input').prop('checked', 'checked');
			if ($(this).children('input').is(':checked')) {
				$('#js-bask-form').submit();
			}
		});

		// ---- Estimate Shipping Function ---- //
		function estimateShipping () {
			function resetFields () {
				$('#js-shipping-estimate-state-select').prop('selectedIndex', 0);
				$('#js-shipping-estimate-country').val(default_country);
				$('#js-shipping-estimate-state, #js-shipping-estimate-zip').val('');
			}

			$('#js-show-shipping-estimate').on('click', function (e) {
				e.preventDefault();
				$('#js-shipping-estimate-dialog').fadeToggle();
				resetFields();
			});

			$('#js-shipping-estimate-recalculate').on('click', function (e) {
				e.preventDefault();
				$(this).hide();
				$('#js-shipping-estimate-results').fadeOut(function () {
					$('#js-shipping-estimate-fields').fadeIn();
				}).empty();
			});

			$('#js-shipping-estimate-form').on('submit', function (e) {
				e.preventDefault();
				if ($(this).data('formstatus') !== 'submitting') {

					var form = $(this),
						formData = form.serialize(),
						formUrl = form.attr('action'),
						formMethod = form.attr('method');

					form.data('formstatus', 'submitting');
					$('#js-processing-request').show();
					$.ajax({
						url: formUrl,
						type: formMethod,
						data: formData,
						success: function(data, textStatus, jqXHR) {
							$('#js-shipping-estimate-fields').fadeOut(function () {
								$('#js-shipping-estimate-results').html(data).fadeIn();
								$('#js-shipping-estimate-recalculate').fadeIn();
							});
							resetFields ();
							form.data('formstatus', 'idle');
							$('#js-processing-request').hide();
						},
						error: function (jqXHR, textStatus, errorThrown) {
							console.log(errorThrown);
							form.data('formstatus', 'idle');
						}
					});
				}
			});
		}
		estimateShipping();

	},

	jsACAD: function () {
		// ---- Copy Email Address to Shipping or Billing Email ---- //
		$('#js-Customer_LoginEmail').on('blur', function () {
			var primaryAddress = $(this).attr('data-primary'),
				shippingEmail = $('#js-Customer_ShipEmail'),
				billingEmail = $('#js-Customer_BillEmail');

			if (primaryAddress === 'shipping') {
				if (shippingEmail && (shippingEmail.val() === '')) {
					shippingEmail.val($(this).val());
				}
			}
			else if (primaryAddress === 'billing') {
				if (billingEmail && (billingEmail.val() === '')) {
					billingEmail.val($(this).val());
				}
			}
		});

		// ---- Toggle Customer Fields Controls ---- //
		// cornerstoneUX.sharedFunctions.toggleCustomerFields();
	},

	jsACED: function () {
		// ---- Toggle Customer Fields Controls ---- //
		// cornerstoneUX.sharedFunctions.toggleCustomerFields();
	},

	jsCTUS: function () {
		// ---- Additional Server Security To Help Against Spambots ---- //
		$.getScript('//ajax.aspnetcdn.com/ajax/jquery.validate/1.13.0/jquery.validate.min.js', function(){
			var contactForm = $('#js-contact-form');
			$('#js-noscript-warning').remove();
			contactForm.show();
			var url = theme_path + '/forms/token.php';
			$.get(url, function (tkn) {
				contactForm.append('<input type="hidden" name="mms" value="' + tkn + '" />');
			});

			// ---- Form Validation ---- //
			contactForm.validate({
				errorContainer: '#js-contact-form div.message',
				errorLabelContainer: '#js-contact-form div.message small',
				errorElement: 'p',
				rules: {
					contactName: {required: true, minlength: 2},
					contactEmail: {required: true, email: true},
					contactComment: {required: true, minlength: 2}
				},
				messages: {
					contactName: {required: 'Your Name Is Required', minlength: jQuery.validator.format('Your Name must be a minimum of {0} characters!')},
					contactEmail: {required: 'Your Email Address Is Required', email: 'Your Email Address must be formatted like name@domain.com'},
					contactComment: {required: 'Comments or Questions Are Required', minlength: jQuery.validator.format('Your Message must be a minimum of {0} characters!')}
				},
				highlight: function (element, errorClass) {
					$(element.form).find('label[for=' + element.id + ']').addClass(errorClass);
				},
				unhighlight: function (element, errorClass) {
					$(element.form).find('label[for=' + element.id + ']').removeClass(errorClass);
				},
				submitHandler: function (form) {
					if ($(this).data('formstatus') !== 'submitting') {
						var form = contactForm,
							formData = form.serialize(),
							formUrl = form.attr('action'),
							formMethod = form.attr('method');

						form.data('formstatus', 'submitting');
						$.ajax({
							url: formUrl,
							type: formMethod,
							data: formData,
							success: function(data, textStatus, jqXHR) {
								// Show reponse message
								if (data.search(/error/i) != -1) {
									$('#js-contact-form div.message').fadeOut(200, function () {
										$(this).removeClass('message-info').addClass('message-error').text(data).fadeIn(200);
									});
								}
								else {
									$('#js-contact-form div.message').removeClass('message-error').addClass('message-success').text(data).fadeIn(200);
								}
								form.data('formstatus', 'idle');
							},
							error: function (jqXHR, textStatus, errorThrown) {
								console.log(errorThrown);
								form.data('formstatus', 'idle');
							}
						});
					}
				}
			});
		});
	},

	jsAFCL: function () {
		// ---- Open Forgot Password ---- //
		cornerstoneUX.sharedFunctions.openForgotPassword();
	},

	jsWLST: function () {
		// ---- Open Forgot Password ---- //
		cornerstoneUX.sharedFunctions.openForgotPassword();
	},

	jsLOGN: function () {
		// ---- Open Forgot Password ---- //
		cornerstoneUX.sharedFunctions.openForgotPassword();
	},

	jsORDL: function () {
		// ---- Open Forgot Password ---- //
		cornerstoneUX.sharedFunctions.openForgotPassword();
	},

	jsORHL: function () {
		// ---- Open Forgot Password ---- //
		cornerstoneUX.sharedFunctions.openForgotPassword();
	},

	jsOCST: function () {
		// ---- Open Log-In Form ---- //
		$('#js-open-ocst-login').magnificPopup({
			focus: '#l-Customer_LoginEmail',
			items: {
				src: $('#js-ocst-login'),
				type: 'inline'
			}
		});

		// ---- Open Forgot Password ---- //
		cornerstoneUX.sharedFunctions.openForgotPassword('jsOCST');

		// ---- Cart Summary Controls ---- //
		cornerstoneUX.sharedFunctions.cartSummary();

		// ---- Google Address Autocomplete ---- //
		// cornerstoneUX.sharedFunctions.mvGAAC.init();

		$(window).on('load', function () {
			if ($('#ShipCountry:disabled')) {
				$('#ShipCountry').parent().removeClass('no-data');
			}
			if ($('#BillCountry:disabled')) {
				$('#BillCountry').parent().removeClass('no-data');
			}
		});


		// ---- Show/Hide State Field --- //
		(function(){
			var $countries = $('#ShipCountry, #BillCountry'),
				updateStateFromCountry = function(){
				var $select = $(this),
					$row = $select.closest('.form-row'),
					$next_row = $row.next('.form-row'),
					$next_select_row = $next_row.find('.js-state-select-wrapper'),
					$next_select = $next_select_row.find('select'),
					$next_input_row = $next_row.find('.js-state-input-wrapper'),
					$next_input = $next_input_row.find('input');

				if( $select.val() === default_country || $select.is(':disabled') ){
					console.log('test');
					$next_select_row.show();
					$next_input_row.hide();
					$next_input.val('');
				} else {
					$next_select_row.hide();
					$next_input_row.show();
					$next_select.val('');
				}
			};

			$countries.each( updateStateFromCountry );
			$countries.on('change', updateStateFromCountry);
		})();



		$('#l-ShipEmail').on('input', function(){
			var $input = $(this),
				email = $input.val();

			$('#js-create-customer-email-display').text( email );
			$('#js-create-customer-email-input').val( email );
		});


		(function(){
			var updateCreateCustomerFields = function(){
				var $toggle = $('#js-create-customer');

				if( $toggle.is(':checked') ){
					$('#js-create-customer-fields').slideDown('fast');
					$('#js-Customer_Password, #js-Customer_VerifyPassword').prop('required', true);
				} else {
					$('#js-create-customer-fields').slideUp('fast');
					$('#js-Customer_Password, #js-Customer_VerifyPassword').val('').trigger('input').prop('required', false);
				}
			};
			$('#js-create-customer').on('change', updateCreateCustomerFields);
			updateCreateCustomerFields();
		})();


		$('#js-Customer_Password, #js-Customer_VerifyPassword').on('input', function(){
			var $password = $('#js-Customer_Password'),
				password = $password.val(),
				$verify_password = $('#js-Customer_VerifyPassword'),
				verify_password = $verify_password.val(),
				$message = $('#js-password-message');

			if( password && password.length && verify_password && verify_password.length ){
				if( password === verify_password ){
					$message.html('<span class="green"><span data-icon="&#x52;"></span> Passwords Match</span>');
				} else {
					$message.html('<span class="red"><span data-icon="&#x51;"></span> Passwords Do Not Match</span>');
				}
			} else {
				$message.html('');
			}
		});

		(function(){
			var createdCustomer = false;
			$('#js-ocst-form').on('submit', function(e){

				var $form = $(this),
					$button = $form.find('input[type="submit"]'),
					fields = $form.serializeArray(),
					data = '',
					screenFound = false;

				// Don't submit if we are already submitting
				if( $form.data('status') === 'submitting' ) return;

				// Let submit proceed if they are not creating customer
				if ( !$('#js-create-customer').is(':checked') ) return;

				// Let submit proceed we have successfully created a customer using the following AJAX call
				if ( createdCustomer ) return;

				e.preventDefault();

				$form.data('status', 'submitting');
				$('#js-messages').html('');
				$button.data('value', $button.attr('value') );
				$button.prop('disabled', true).attr('value', 'Creating Account...');

				if( ToggleDetails.trigger.checked ){
					ToggleDetails.CopyFields();
					$(ToggleDetails.secondary_inputs, ToggleDetails.secondary_selects).trigger('input');
				}

				$.each(fields, function(i, field){
					// Rename OCST fields to create an account
					if( field.name === 'Action' ){
						data += '&Action=ICST';
					} else if( field.name === 'Screen' ){
						data += '&Screen=ACED';
						screenFound = true;
					} else if( /(Ship|Bill)/.test(field.name) ){
						data += '&Customer_' + field.name + '=' + field.value;
					} else {
						data += '&' + field.name + '=' + field.value;
					}
				});

				if( !screenFound ){
					data += '&Screen=ACED';
				}

				var cust_create_url = $('#customer_create_url').val();

				$.ajax({
					url: cust_create_url,
					type: 'POST',
					dataType: 'json',
					data: data + '&api=1',
				})
				.done(function(response) {
					if( response.page_code ==='ACED' ){
						createdCustomer = true;
						$form.append('<input type="hidden" name="Customer_Created" value="yes">');
						$form.submit();
					} else if( response.error_messages.length ){
						var html = '<div class="message message-error">';
						html += '<br />';
						$.each(response.error_messages, function(i, error){
							html += error + '<br>';
						});
						html += '</div>';
						$('#js-messages').html(html);
						scrollToDiv( $('#js-messages'), 50);
						// TODO: Add better input validation
					}
				})
				.always(function() {
					$form.data('status', '');
					$button.prop('disabled', false).attr('value', $button.data('value') );
				});

			});
		})();

	},

	jsOSEL: function () {
		// ---- Cart Summary Controls ---- //
		cornerstoneUX.sharedFunctions.cartSummary();
	},

	jsOPAY: function () {
		// ---- Cart Summary Controls ---- //
		cornerstoneUX.sharedFunctions.cartSummary();

		// ---- Make Credit Card Expiration Fields More User-Friendly ---- //
		$('#js-cc_exp select').first().find('option:first').text('Month');
		$('#js-cc_exp select').last().find('option:first').text('Year');

		// ---- CVV Information Function ---- //
		$('#js-open-cvv-information').magnificPopup({
			items: {
				src: $('#js-cvv-information'),
				type: 'inline'
			}
		});

		// ---- Secondary Form Submit Button ---- //
		$('#js-opay-form-submit').on('click', function () {
			$('#js-opay-form').submit();
		});

		// ---- Opayments ---- //
		(function(){
			var opayments = {};
			opayments.debug = false;
			opayments.$form = $('input[name="Action"]').closest('form');
			opayments.$actualRows = $('.payment-field-row');
			opayments.$proxyInputs = $('.proxy-input');

			opayments.init = function(){
				if( !$('.proxy-payment-fields').length ){
					return;
				}
				opayments.copyAllActualToProxy();
				opayments.$actualRows.on('input keyup blur change', 'input, select', opayments.copyAllActualToProxy);
				opayments.$proxyInputs.on('input keyup blur change', opayments.copyProxyInputToActual);
				opayments.$form.on('submit', opayments.copyAllProxyToActual );

				if( opayments.debug ){
					opayments.$actualRows.css('opacity', 0.5);
				} else {
					opayments.$actualRows.hide();
				}
				$('.proxy-payment-fields').show();
			};

			opayments.copyActualRowToProxy = function(){
				var $row = $(this),
					code = $row.data('code'),
					invalid = $row.data('invalid'),
					classes = (!!invalid) ? 'invalid red' : '',
					$input = $row.find('input');

				switch (code) {
					case 'cc_exp':
						$('.proxy-input-cc_exp_month').closest('.proxy-payment-field-row').addClass(classes);
						$('.proxy-input-cc_exp_month').val( $row.find('[name*="Month"], [name*="month"]').val() );
						$('.proxy-input-cc_exp_year').val( $row.find('[name*="Year"], [name*="year"]').val() );
						break;
					case 'cc_name':
					case 'cc_fname':
					case 'cc_lname':
					case 'cc_number':
					case 'cc_cvv':
					case 'cvv':
					default:
						$('.proxy-input-' + code).closest('.proxy-payment-field-row').addClass(classes);
						$('.proxy-input-' + code).val( $input.val() );
						break;
				}
			};

			opayments.copyAllActualToProxy = function(){
				opayments.$actualRows.each( opayments.copyActualRowToProxy );
			};

			opayments.copyProxyInputToActual = function(){
				var $input = $(this),
					code = $input.data('code'),
					$proxy = {};

				switch (code) {
					case 'cc_exp_month':
						$proxy = opayments.$form.find('[name*="Month"], [name*="month"]');
						break;
					case 'cc_exp_year':
						$proxy = opayments.$form.find('[name*="Year"], [name*="year"]');
						break;
					case 'cc_name':
					case 'cc_fname':
					case 'cc_lname':
					case 'cc_number':
					case 'cc_cvv':
					case 'cvv':
					default:
						$proxy = $('.payment-field-row-' + code).find('input');
						break;
				}

				$proxy.val( $input.val() );
			};
			opayments.copyAllProxyToActual = function(){
				opayments.$proxyInputs.each( opayments.copyProxyInputToActual );
			};

			opayments.init();
		})();

		(function creditCardFormatting(){
			$.getScript('https://cdnjs.cloudflare.com/ajax/libs/jquery.payment/1.3.2/jquery.payment.min.js', function(){
				var creditCardTypeMap = {
					visa: '.payment-method-selectors input:radio[data-name="Visa"]',
					mastercard: '.payment-method-selectors input:radio[data-name="MasterCard"]',
					amex: '.payment-method-selectors input:radio[data-name="American Express"]',
					discover: '.payment-method-selectors input:radio[data-name="Discover"]'
				},
				$form = $('#js-opay-form'),
				$paymentMethods = $form.find('input:radio[name="PaymentMethod"]'),
				$cc_number = $form.find('.proxy-input-cc_number'),
				updatePaymentMethod = function(){
					var type = $.payment.cardType( $cc_number.val() ),
						$matchingPaymentMethod = $(creditCardTypeMap[type]);

					if( $matchingPaymentMethod.length ){
						$matchingPaymentMethod.prop('checked', true);
					}
				};
				$cc_number.payment('formatCardNumber').on('input blur', updatePaymentMethod);
				$('.proxy-input-cc_cvv, .proxy-input-cvv').payment('formatCardCVC');
				updatePaymentMethod();
			});
		})();
	},

	jsINVC: function () {
	},

	jsORDP: function () {
		// ---- Launch Printer Dialog ---- //
		window.print();
	},

	jsSMAP: function () {
		// ---- Conform all site map DIVs to same height ---- //
		// cornerstoneUX.sharedFunctions.conformDisplay('.site-map');
	},

	jsGFTL: function () {
		// ---- Open Forgot Password ---- //
		cornerstoneUX.sharedFunctions.openForgotPassword();
	},

	jsWLGN: function () {
		// ---- Open Forgot Password ---- //
		cornerstoneUX.sharedFunctions.openForgotPassword();
	}
};
cornerstoneUX.init();