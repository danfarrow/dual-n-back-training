"use strict";

export default class {
   constructor( gui  ){

      // Create cell grid
      this.cells = [];
      const cellsDiv = document.createElement( 'div' );
      cellsDiv.classList.add( 'module', 'cells' );

      for( let i = 0; i < 9; i++ ){
         const cell = document.createElement( 'div' );
         cellsDiv.appendChild( cell );
         this.cells.push( cell );
      }

      // Create caption elements
      const header = document.createElement( 'div' );
      header.classList.add( 'module', 'header' );
      const title = document.createElement( 'h1' );
      title.innerText = 'Dual N Back trainer';
      header.appendChild( title );

      const surtitle = document.createElement( 'h2' );
      header.appendChild( surtitle );
      this.surtitle = surtitle;

      const subtitle = document.createElement( 'h2' );
      header.appendChild( subtitle );
      this.subtitle = subtitle;

      // Append everything
      gui.appendChild( header );
      gui.appendChild( cellsDiv );
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