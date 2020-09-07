//keyboard.0.0.1.js

KEYBOARD = (function() {// Enclosing () creates a function expression instead of a function declaration
	var api = {},// Attach public vars & methods
		keymap;// Private var

    /**
     * Public init method
     */
    api.init = function( k ){
    	// console.log( "Keyboard module","init");
    	document.onkeypress = onKeyPress;
    	keymap = k;
    }

	/*
	 * Keyboard event listener
	 */
	function onKeyPress( ev ){
		// Check for shift
		var key = ev.which,
			isShift = !!ev.shiftKey,
			isAlt = !!ev.altKey,
			isCtrl = !!ev.ctrlKey,
			keyCode = ev.keyCode;

		if ( 0 == keyCode ) { keyCode = key; }
		if ( isShift ) { keyCode = "s" + keyCode; }
		if ( isCtrl ) { keyCode = "c" + keyCode; }
		if ( isAlt ) { keyCode = "a" + keyCode; }

		// Map keycode
		var f = keymap[ keyCode ];

		if ( f ) {
			// Key mapped to function
			// with 0, 1 or 2 params
			ev.preventDefault();

			switch ( f.length ){
				case 1: f[0](); break;
				case 2: f[0]( f[1] ); break;
				case 3: f[0]( f[1], f[2] ); break;
			}
		}
	}

	return api;

})();
