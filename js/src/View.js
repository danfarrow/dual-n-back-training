"use strict";

export default class {
   constructor( gui  ){
      // Create cell elements
      this.cells = [];
      const cellsDiv = document.createElement( 'div' );
      cellsDiv.classList.add( 'cells' );

      for( let i = 0; i < 9; i++ ){
         const cell = document.createElement( 'div' );
         cellsDiv.appendChild( cell );
         this.cells.push( cell );
      }

      // Create caption elements
      this.surtitle = document.createElement( 'h2' );
      this.subtitle = document.createElement( 'h2' );

      // Append everything
      gui.appendChild( this.surtitle );
      gui.appendChild( cellsDiv );
      gui.appendChild( this.subtitle );
   }

   showSubtitle( txt ){
      this.subtitle.innerHTML = txt;
   }

   showSurtitle( txt ){
      this.surtitle.innerHTML = txt;
   }

   showQuestion( q ){
      const position = q.dimensions.position,
         colour = q.dimensions.colour,
         cell = this.cells[ position ];

      cell.setAttribute( 'style', `background-color: ${colour};` );
   }

   removeQuestion( q ){
      const position = q.dimensions.position,
         cell = this.cells[ position ];

      cell.removeAttribute( 'style' );
   }

}