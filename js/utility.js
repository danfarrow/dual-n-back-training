/**
 * Utility: getElementById proxy
 */
function $( id ){
	if ( "string" != typeof id ) { return id; }
	return document.getElementById( id );
}