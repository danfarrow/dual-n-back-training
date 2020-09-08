"use strict";

export default class {
   constructor( dimensions ){

      // Create new values for each dimension
      for( const dimensionName in dimensions ){
         const dimension = dimensions[ dimensionName ],
            values = dimension.values;

         this[ dimensionName ] = values[ Math.floor( Math.random() * values.length ) ];
      }
   }

   /**
    * Return array of dimension names whose
    * values in the target question match
    * corresponding values in this question
    */
   compare( q ){
      if ( !q ) return [];
      const matches = [];
      for( let d in q ) if( q[d] === this[d] ) matches.push( d );
      return matches;
   }
}