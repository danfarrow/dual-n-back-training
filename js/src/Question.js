"use strict";

export default class {

   /**
    * Question class represents a single
    * question of multiple dimensions
    */
   constructor( dimensions ){

      this.dimensions = {};

      // Create new values for each dimension
      for( const dimensionName in dimensions ){

         const dimension = dimensions[ dimensionName ];
         const values = dimension.values;
         const randomItem = Math.floor( Math.random() * values.length );

         this.dimensions[ dimensionName ] = values[ randomItem ];
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

      for( let d in q.dimensions ) {
         if( q.dimensions[d] === this.dimensions[d] ){
            matches.push( d );
         }
      }

      return matches;
   }
}