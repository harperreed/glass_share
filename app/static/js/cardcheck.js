/*!
 * Card Check
 * 
 * A credit card validator and type guesser 
 * 
 * This plugin allows you to easily get the credit card type of 
 * whatever number is being entered. It is highly configurable 
 * to allow you to add additional credit card types as needed 
 * without ever having to adjust the internal code.
 *  
 * For documentation, look in the package you downloaded or go to
 * http://eclarian.com/cardcheck/
 * 
 * NOTE: This is not open source software and you must purchase
 * a license to legally use.
 * 
 * @uses       jQuery
 * @author     Eclarian Dev Team <eclarian@eclarian.com>
 * @copyright  Eclarian LLC
 * @date       November 29, 2011
 * @version    1.0.0
 */
(function($) {

	// Public Function $.cardcheck('#card-input', { onValidation: function() { ... } });
    $.cardcheck = function(element, options) {
		
		// Check if options defined by element and remap
		// Allows initialization like $.cardcheck({ input: '#card-input' });
		if ( typeof element === 'object' && 'input' in element ) {
			options = element;
			element = options.input;			
		}
			
		// Default Configuration
        var config = {
			
			// Callback Methods
			onReset: function() {},
			onError: function(type) {},
			onValidation: function(type, niceName) {},
            onTypeUpdate: function(type, niceName) {},
			
			// Basic Initialization Options
			input: false,
			allowSpaces: true,
			acceptedCards:  [
				'visa',
				'mastercard',
				'amex',
				'diners',
				'discover',
				'jcb'
			],
			
			// Icon Configuration
			enableIcons: true,
			iconLocation: '',
			iconDir: '/images/',
			iconExt: 'png',
			iconClass: 'card-icons',
			
			// Advanced Initialization Options
			niceNames: {
				visa: "Visa", 
				mastercard: "Mastercard", 
				amex: "American Express", 
				discover: "Discover", 
				diners: "Diners Club", 
				jcb: "JCB"
			},
			regExpNumCheck: "^[0-9]+$",
			// Allows for type guessing
			regExpApprox: {
				visa: "^4", 
				mastercard: "^5[1-5]", 
				amex: "^(34|37)", 
				discover: "^6011", 
				diners: "^(30|36|38|39)",			
				jcb: "^35"
			},
			// Begin guessing type at one character. All arrays to maintain similar type
			startNum: {
				visa: ['4'], 
				mastercard: ['5'], 
				amex: ['3'],
				discover: ['6'], 
				diners: ['3'],				
				jcb: ['3', '2', '1']
			},
			// Determine when to use validation
			cardLength: {
				visa: [13, 16], 
				mastercard: [16], 
				amex: [15],
				discover: [16], 
				diners: [14],				
				jcb: [15, 16]
			}
        },
		
		// --------------------------------------------------------------------------------
		
			uniqueClass = +new Date(), // Allows us to create uniqueClass classes so that multiple instances can exist
			cardcheck = this, // Make it easier to read the things associated with this instance
			isValidated = false,
			inputIsNaN = false,
			$element = $(element);		
		
		// --------------------------------------------------------------------------------
		
		// Object Properties
		cardcheck.settings = {};
		cardcheck.lastType = '';	
			
		// --------------------------------------------------------------------------------
		
		/**
		 * Min
		 * 
		 * @param   array
		 * @return  int
		 */
		var min = function(array) {
			return Math.min.apply( Math, array );
		};
		
		// --------------------------------------------------------------------------------
		
		/**
		 * Max
		 * 
		 * @param   array
		 * @return  int
		 */
		var max = function(array) {
			return Math.max.apply( Math, array );
		};
		
		// --------------------------------------------------------------------------------
		
		/**
		 * Get Type of Credit Card
		 * 
		 * This function also controls and integrates the validation aspects of cardcheck
		 * 
		 * @param   string
		 * @return  boolean
		 */
		var getType = function(number) {
		
			// Lets see if we're ignoring any spaces
			// This allows end users to type CC nums like 4111 1111 1111
			if ( cardcheck.settings.allowSpaces === true ) {
				number = number.replace(/\s/g, '');
			}			
			
			// Can't validate anything with one or fewer digits
			if ( number.length < 1 ) {
				return false;
			}			
			
			var isNumber = new RegExp( cardcheck.settings.regExpNumCheck );
			
			// Make sure that we only have numbers here
			// TODO: Should we ignore and allow spaces?
			if ( ! number.match( isNumber ) ) {
				inputIsNaN = true;
				cardcheck.settings.onError( 'NaN' );
				return false;
			}
			
			// If they typed invalid characters before, lets reset 
			if ( inputIsNaN === true ) {
				inputIsNaN = false;
				cardcheck.settings.onReset();
			}
			
			var type = false;
			
			// Get the Type
			$.each( cardcheck.settings.acceptedCards, function(k, re) {
				
				// Check if it can be known from one character, otherwise fallback on regex
				if ( number.length === 1 && re in cardcheck.settings.startNum ) {
					// Continue because this could match three separate cards
					if ( number === '3' ) {
						return true;
					} else if ( $.inArray(number, cardcheck.settings.startNum[re]) !== -1 ) {
						type = re;
						return false; // we found it!
					}
				}
				
				// Stores the regular expression
				var exp, 
					fullValidation = false,
					highestValue = false,
					beyondLength = false;
				
				// Check if we should require full validation based on whether the max card length is reached
				// TODO: could produce false positives for multiple card lengths.
				if ( re in cardcheck.settings.cardLength && $.inArray(number.length, cardcheck.settings.cardLength[re]) !== -1 ) {
					fullValidation = true;
				} else if ( number.length >= max(cardcheck.settings.cardLength[re] ) ) {
					fullValidation = true;
					highestValue = true;
					beyondLength = ( number.length > max(cardcheck.settings.cardLength[re] ) );
				// Whether the isValidated is true OR if the current number is less than minimum card length
				// We can rely on the fact that we need to reset here if isValidated is TRUE because of the 
				//  fact that the cardlength is not the current length of the string so it's impossible its still valid 
				} else if ( isValidated === true ) {
					isValidated = false;
					cardcheck.settings.onReset(); // TODO: check if there are other fringe scenarios that require the reset
				}
				
					
				// Continue approximation with simple regex to test beginning of string
				if ( re in cardcheck.settings.regExpApprox ) {
					exp = new RegExp( cardcheck.settings.regExpApprox[re] );
					
					// Check the Type - Only validate if type is found
					if ( number.match(exp) ) {
						
						// This is where the type is found
						type = re;
						
						// Check to see if we require full validation yet
						if ( fullValidation === false ) {
							return false;
						}
						
						// Check the LuhnCheck at this point to make sure that it validates
						// OUTSTANDING ISSUE: The luhn check can pass even if the card is not complete
						//  Example would be visa being able to have longer cards. 
						if ( luhnCheck( number ) === true && ! beyondLength ) {
							isValidated = true; // So that if it invalidates in the future, we can test it
							cardcheck.settings.onValidation(re, getTypeNiceName(re)); // We've found a valid credit card number.
						// Soft Failure - there is another possibility with more chars
						} else if ( highestValue ) {
							isValidated = false;
							cardcheck.settings.onError(re);
						// Lower than min card length TODO: make sure the card type hasn't changed
						} else if ( number.length < min(cardcheck.settings.cardLength[re]) ) {
							cardcheck.settings.onReset();
						}
												
						return false; // Same as break in for loop						
					}
				}				
			});
			
			return type;
		};
		
		// --------------------------------------------------------------------------------
		
		/**
		 * Get Type Nice Name - For Display Purposes
		 * 
		 * @param   string
		 * @return  string
		 */
		var getTypeNiceName = function(slug) {
			return cardcheck.settings.niceNames[slug];
		};

		// --------------------------------------------------------------------------------
		
		/**
		 * Luhn Check of the Credit Card Number
		 * 
		 * @param   string
		 * @return  boolean
		 */
		var luhnCheck = function(number) {
			var luhnArr = [[0,2,4,6,8,1,3,5,7,9],[0,1,2,3,4,5,6,7,8,9]],
				sum = 0;
			
			number.replace(/\D+/g,"").replace(/[\d]/g, function(c, p, o){
				sum += luhnArr[ (o.length - p) & 1 ][ parseInt(c, 10) ];
			});
			return ( sum % 10 === 0 ) && ( sum > 0 );
		};		
		
		// --------------------------------------------------------------------------------
		
		/**
		 * Create Card Icons
		 * 
		 * NOTE: Icons must be named EXACTLY the same as the acceptedCards
		 */
		var createCardIcons = function() {
			
			// Icons are disabled... SORRY!
			if ( cardcheck.settings.enableIcons === false ) {
				return false;
			} 
			
			var iconLoc = (cardcheck.settings.iconLocation) ? $(cardcheck.settings.iconLocation): $element.parent();
			
			// Loop over all Accepted Cards and create the icons for them.
			$.each( cardcheck.settings.acceptedCards, function( k, icon ) {
				iconLoc.append( $('<img>').attr( 'id', 'card-' + icon + uniqueClass )
					.attr( 'src', cardcheck.settings.iconDir + icon + '.' + cardcheck.settings.iconExt )
					.addClass( cardcheck.settings.iconClass + uniqueClass ) );
			});
		};
		
		// --------------------------------------------------------------------------------
		
		/**
		 * Initialization
		 * 
		 * Automatically binds the events to the element defined and merges additional
		 * options onto the settings.
		 */
		var init = function() {			
			cardcheck.settings = $.extend({}, config, options);
			
			// Create Images
			createCardIcons();
			
			// Bind Event (we could use $element.on() here, but want to preserve compatability)
			$element.bind("keyup.cardcheck change.cardcheck", function() {
				
				var number = $element.val(),
					type = getType(number);					
				
				// NOTE: The iconClass is not cached in a var because it doesn't exist yet
				
				// Prevent Cards from flashing as you type
				if ( cardcheck.lastType !== type && type !== false ) {
					// Fade only the card type that is not selected
					$( '.' + cardcheck.settings.iconClass + uniqueClass ).not('#card-' + type + uniqueClass).fadeTo('fast', 0.2);
					$('#card-' + type + uniqueClass).css('opacity', 1);

					// Call on Reset whenever the type changes, even if its the first time.
					// This is because the escape key is not registered properly when held
					//  down via the keypress event.
					cardcheck.settings.onReset();
					
					// Call Method onTypeUpdate
					cardcheck.settings.onTypeUpdate( type, getTypeNiceName(type) );
				}
				
				// Check if empty
				if ( ! number ) {
					cardcheck.lastType = '';
					$( '.' + cardcheck.settings.iconClass + uniqueClass ).css('opacity', 1);	
					
					// Call Type Update because the number has changed. Type will be false.
					cardcheck.settings.onTypeUpdate( type, '');
				}
				
				// Set Current Type
				cardcheck.lastType = type;
			});			
		};

		// --------------------------------------------------------------------------------
		
		// Let's get it ROLLING!
        init();
				
		// Make this thing chainable in case we want to chuck on a class or something
		return $element;
    }

	/**
	 * Allows you to do this: $('#credit-card').cardcheck();
	 */
    $.fn.cardcheck = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('cardcheck')) {
				return $.cardcheck(this, options).data('cardcheck', 'true');
            }
        });
    }

})(jQuery);