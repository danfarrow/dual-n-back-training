"use strict";

import Question from './Question.js';
import View from './View.js';

/**
 * Dual N-Back training app
 *
 * Code walkthrough
 * ----------------
 * * Start game
 * * While questionCount < totalQuestions:
 *    * Game creates new Question
 *       * Question object receives array of dimensions
 *       * Question object creates array of dimension instances
 *    * Game queries Question against n-back-th Question to create Answer object
 *       * Answer contains array of matching dimensions
 *    * Game displays Question to user
 *    * User responds or not to create Response object
 *    * Game queries Response against Answer to get score nBackOffset
 *       * User scores +1 for each correctly matched dimension
 *       * User scores -1 for each incorrectly matched dimension
 *       * User scores -1 for each missed dimension
 *    * Game updates score accordingly and creates next Question
 * * End game
 *
 * Roadmap
 * -------
 * - Show sparkline of progress
 * - Add user config frontend with local storage
 */
export default class {

   constructor( elem, userConfig = {} ){

      // Config
      const defaultConfig = {
         dimensions: {
            colour: {
               triggerKey: 'Q',
               triggerKeyCode: 81,
               values: [ '#ed553b', '#20639b', '#f6d55c' ]
            },
            position: {
               triggerKey: 'E',
               triggerKeyCode: 69,
               values: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
            }
         },
         nBackOffset: -2,// How many steps back to compare against
         questionBuffer: 200,// Milliseconds - gap between questions
         questionDuration: 1800,// Milliseconds - how long to show question
         targetRounds: 20,// Game end target if endOnTargetPotentialScore === false
         targetPotentialScore: 20,// Game end target if endOnTargetPotentialScore === true
         endOnTargetPotentialScore: true // End game on targetPotentialScore | targetRounds
      };

      // Merge configs
      this.config = { ...defaultConfig, ...userConfig };

      // Create view & instructions
      this.view = new View( elem );
      const rules = [];

      // Display rules in gui
      for( const d in this.config.dimensions )
         rules.push(
            `<strong>${ this.config.dimensions[d].triggerKey }</strong>: ${d}`
         );

      this.view.showSurtitle(
         `${ rules.join(', ') },
         N-back: <strong>
         ${ this.config.nBackOffset }
         </strong>`
      );

      this.view.showSubtitle( 'Press SPACE to start' );

      // Listen for keypresses & init
      document.addEventListener( 'keydown', (e) => this.onKeyPress(e) );

      this.resetGame();
   }

   /**
    * Reset
    */
   resetGame(){
      this.timeoutId = null;
      this.questions = [];// Array of questions in current/last round
      this.response = [];// Holds user response while question is active
      this.gameState = 'ready';// 'ready', 'question', 'over'
      this.potentialScore = 0;
      this.round = 0;
      this.score = 0;
   }

   /**
    * Keypress event handler
    */
   onKeyPress( e ){

      // Start game if space pressed
      if( 32 === e.keyCode && 'ready' === this.gameState ) this.questionEnd();

      // Abort game if ESC pressed
      if( 27 === e.keyCode && 'ready' !== this.gameState) this.gameEnd();

      // Check if currently accepting user responses
      if( !this.currentQuestion ) return;

      // Check for valid user response
      for( const d in this.config.dimensions )
         if( e.keyCode === this.config.dimensions[ d ].triggerKeyCode )
            this.onUserResponse( d );
   }

   /**
    * End game
    */
   gameEnd(){
      clearInterval( this.timeoutId );
      this.clearCurrentQuestion();
      this.gameState = 'over';

      // Calculate % score, including possibility that potentialScore === 0
      let percentage = Math.round( 100 * this.score / this.potentialScore );
      const scorePercentage = isNaN( percentage ) ? 'n/a' : `${percentage}%`;

      // Show score summary
      this.view.showSubtitle(
         `Game over! Score <strong>${ scorePercentage }</strong>
         ( ${ this.score } / ${ this.potentialScore } )
         <br />Press SPACE to restart`
      );
      this.resetGame();
   }

   /**
    * User has responded with dimension d - update response
    */
   onUserResponse( d ){
      if( this.response.indexOf( d ) !== -1 ) return;

      // Response is not already registered so add to responses
      this.response.push( d );
   }

   /**
    * Instantiate a new Question
    */
   questionCreate(){
      const q = new Question( this.config.dimensions );
      this.questions.push( q );
      this.currentQuestion = q;
      this.gameState = 'question';
      this.view.showQuestion( q );
   }

   /**
    * Clear the grid
    */
   clearCurrentQuestion(){
      // this.view.showSubtitle( '' );
      if( !this.currentQuestion ) return;
      this.view.removeQuestion( this.currentQuestion );
      this.currentQuestion = null;
   }

   /**
    * End the current question, set timeout for next
    */
   questionEnd(){
      // Compare current question with nth-back
      // to get dimension intersection
      const currentIndex = this.questions.length - 1,
         nBackIndex = currentIndex + this.config.nBackOffset;

      let dimensionMatches = [];

      if( nBackIndex >= 0 ){
         const nBackthQuestion = this.questions[ nBackIndex ];
         dimensionMatches = this.currentQuestion.compare( nBackthQuestion );
         console.log( dimensionMatches );
      }

      // Add to potential score
      this.potentialScore += dimensionMatches.length;

      // Query user response against current
      // question to get actual score
      for( const d in this.config.dimensions ){
         if( dimensionMatches.includes( d ) && this.response.includes( d ) ){
            this.score++;
         } else if( dimensionMatches.includes( d ) || this.response.includes( d ) ){
            this.score--;
         }
      }

      this.clearCurrentQuestion();// Clear grid
      this.response = [];// Clear user response

      // Set timeout for next question or gameEnd
      if(
         this.config.endOnTargetPotentialScore && this.potentialScore < this.config.targetPotentialScore
         || !this.config.endOnTargetPotentialScore && this.round < this.config.targetRounds
      ){
         this.timeoutId = setTimeout(
            () => this.nextQuestion(),
            this.config.questionBuffer
         );
      } else {
         this.gameEnd();
      }

   }

   /**
    * Create the next question
    */
   nextQuestion(){
      ++this.round;
      this.questionCreate();

      // Update view subtitle
      if( this.config.endOnTargetPotentialScore ){
         this.view.showSubtitle( `Score: ${this.score} / ${this.potentialScore}` );
      } else {
         this.view.showSubtitle( `Round: ${this.round} / ${this.config.targetRounds}` );
      }

      // Set timeout for question duration
      this.timeoutId = setTimeout(
         () => this.questionEnd(),
         this.config.questionDuration
      );
   }
}