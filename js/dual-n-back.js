/**
 * @todo Re-structure app:
 *
 * Game flow:
 * - A game consists of a number of rounds (roundsPerGame)
 * - A round has one question
 * - Each question has a number of dimensions (dimensionsArray)
 * - The question is displayed for a fixed amount of time (questionDuration)
 * - An answer consists of an array of matching dimensions
 * - The player submits an answer one dimension at a time
 * - At the end of the questionDuration each dimension of the question is appraised
 * - Players gain points for correctly identifying each matching dimension
 * - Players lose points for incorrectly identifying a dimension match
 * - Players lose points for failing to identify a dimmension match
 * - At the end of the game the players score is displayed as a percentage of potentially available score
 *
 * Objects
 *    Game object
 *       GUI
 *       Questions
 *       Score
 *    Question object
 *       Dimension 1
 *       Dimension 2
 *    Answer object
 *       Dimension 1
 *       Dimension 2
 *
 * @todo Abstract question dimensions into class
 * @todo Blank grid buffer between questions
 */
NBACK = (function() {
 	var api = {};

   let cellsModel = [],// Model representing question cells
      colours = [ 'red', 'blue', 'green' ],
      dimensions = [ 'position', 'colour' ],// Not yet used
      dimensionKeys = [ 101, 113 ], // e, q -- Not yet used
      gameStarted = false,
      lastCell,
      offset = -2,
      potentialScore = 0,
      questionAnsweredColour = false,
      questionAnsweredPosition = false,
      questionBuffer = 500, // Milliseconds
      questionDuration = 1500, // Milliseconds
      questions = [],// Array of questions in current/last round
      round = 0,
      roundsPerGame = 10,
      score = 0,
      subtitle;

 	// API: Set everything up
 	api.init = function( elem ){
      gameInit( elem );
  	}

   // API: Key was pressed
   api.onKeyPress = function( s ){
      switch( s ){
         case 'colour':
            // Check game in progress & colour not answered
            if ( !gameStarted || questionAnsweredColour ){
               return;
            }

            questionAnsweredColour = true;
            console.log( 'Colour key pressed' );

            // Check answer is correct
            answerCheck( 'colour' );
            break;
         case 'position':
            // Check game in progress & position not already answered for this round
            if ( !gameStarted || questionAnsweredPosition ){
               return;
            }

            questionAnsweredPosition = true;

            console.log('Position key pressed');
            answerCheck( 'position' );

            break;
         case 'start':
            if ( gameStarted ){ return; }
            console.log('start key pressed');
            gameStart();
            break;
      }
   }

   ///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\
   ///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\
   ///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\

   /**
    * Check the submitted answer & adjust score accordingly
    */
   const answerCheck = function( dimension ){
      let currentQuestionIndex = questions.length,
         currentQuestion = questionRetrieve( currentQuestionIndex ),
         nbackthQuestion = questionRetrieve( currentQuestionIndex + offset ),
         dimensionMatches = dimensionMatch( currentQuestion, nbackthQuestion, dimension );

      if ( dimensionMatches ){
         switch( dimension ){
            case 'colour':
               questionAnsweredCorrectlyColour = true;
               break;
            case 'position':
               questionAnsweredCorrectlyPosition = true;
               break;
         }
         scoreAdd();
      } else {
         scoreSubtract();
      }
   }

   /**
    * Confirm dimension match between two questions
    */
   const dimensionMatch = function( q1, q2, dimension ){
      // Get n-backth question
      let currentQuestionIndex = questions.length - 1,
         currentQuestion = questions[ currentQuestionIndex ],
         nbackth = questions[ currentQuestionIndex + offset ];

      if ( !nbackth ){ return false; }

      if (
         undefined === q1
         || undefined === q2
         || undefined === q1[ dimension ]
         || undefined === q2[ dimension ]
      ){
         return false;
      }

      return q1[ dimension ] === q2[ dimension ];
   }

   const display = function( txt ){
      subtitle.innerHTML = txt;
   }

   /**
    * Create GUI
    */
   const gameInit = function(elem){
      guiCreate( elem );
      display( 'Press SPACE to start' );
   }

   /**
    * Start game
    */
   const gameStart = function(){
      gameStarted = true;
      setTimeout( roundNext, questionDuration );
   }

   /**
    * End game
    */
   const gameEnd = function(){
      onGameEnd();
   }

   /**
    * Create the GUI grid, surtitle & subtitle markup
    */
   const guiCreate = function( gui ){

      // Create grid
      let cell,
         cells = document.createElement( 'div' );

      cells.classList.add( 'cells' );

      for( let r = 0; r < 3; r++ ){
         for( let c = 0; c < 3; c++ ){
            cell = document.createElement( 'div' );
            cells.appendChild( cell );
            cellsModel.push( { 'gui':cell } );
         }
      }

      // Create captions
      surtitle = document.createElement( 'h2' );
      surtitle.innerHTML = `<strong>Q</strong> COLOUR
         <strong>E</strong> POSITION
         N-Back <strong>${offset}</strong>`;

      subtitle = document.createElement( 'h2' );
      gui.appendChild( surtitle );
      gui.appendChild( cells );
      gui.appendChild( subtitle );
   }

   /**
    * Event callback for creating a new question
    */
   const onQuestionCreate = function(){
      display( `Round <strong>${round}<strong> of <strong>${roundsPerGame}</strong>` );
   }

   /**
    * Event callback for game ending
    */
   const onGameEnd = function(){
      display( `Game over - score <strong>${scoreGet()}</strong>` );
   }

   /**
    * Create a new question
    */
   const questionCreate = function(){
      // @todo Brief delay between questionDestroy and question
      // @todo Check if previous question could have earned points & track potential points

      // Choose a random cell
      let position = Math.floor( Math.random() * cellsModel.length ),
         cellGui = cellsModel[ position ].gui;

      // Choose a random colour
      // @todo Make sure colour changes if cell is same as previous
      let colour = colours[ Math.floor( Math.random() * colours.length ) ];
      console.log( position, colour );

      questions.push( {'position': position, 'colour':colour, 'gui': cellGui } );

      // Update gui
      if( lastCell ){ lastCell.removeAttribute( 'style' ); }
      lastCell = cellGui;
      cellGui.setAttribute( 'style', `background-color: ${colour};` );

      // Update flags
      questionAnsweredColour = false;
      questionAnsweredPosition = false;
      questionAnsweredCorrectlyColour = false;
      questionAnsweredCorrectlyPosition = false;

      onQuestionCreate();
   }

   const questionDestroy = function(){
      // @todo Check if previous question had possible points
      if ( answerCheck('colour') && !questionAnsweredCorrectlyColour ){
         scoreSubtract();
      }

      if ( answerCheck('position') && !questionAnsweredCorrectlyPosition ){
         scoreSubtract();
      }

   }

   /**
    * Retrieve the n-backth question
    */
   const questionRetrieve = function( currentQuestionIndex ){
      return questions[ currentQuestionIndex ];
   }

   const roundNext = function(){
      ++round;
      questionDestroy();
      questionCreate();

      if ( round < roundsPerGame ){
         setTimeout( roundNext, questionDuration );
      } else {
         setTimeout( gameEnd, questionDuration );
      }
   }

 	// Add score
 	scoreAdd = function(){
      console.log( "++score" );
      return ++score;
   }

 	// API: Get score
 	scoreGet = function(){
      return score;
   }

   // Subtract score
   scoreSubtract = function(){
      console.log( "--score" );
      return --score;
   }

 	// Done
	return api;

})();
