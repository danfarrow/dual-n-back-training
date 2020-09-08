"use strict";

import Question from "./Question.js";
import View from "./View.js";


/**
 * Set everything up when ready
 */
document.addEventListener(
   "DOMContentLoaded",
   () => new NBack( document.getElementById( "container") )
);

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
 * - Add restart option at end of game
 * - ESC key to quit current game
 * - Add config options with local storage
 */

class NBack {

   constructor( elem ){


      // Config
      this.config = {
         dimensions: {
            colour: {
               triggerKey: "Q",
               triggerKeyCode: 81,
               values: [ '#ed553b', '#20639b', '#f6d55c' ]
            },
            position: {
               triggerKey: "E",
               triggerKeyCode: 69,
               values: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
            }
         },
         nBackOffset: -2,
         questionBuffer: 200, // Milliseconds
         questionDuration: 1800, // Milliseconds
         roundsPerGame: 20
      }

      // Init
      this.questions = [];// Array of questions in current/last round
      this.response = [];// Holds user response while question is active
      this.gameState = "ready";// "ready", "question", "buffer", "over"
      this.potentialScore = 0;
      this.round = 0;
      this.score = 0;

      // Create view
      this.view = new View( elem );

      // Populate captions
      const rules = [];

      for( const d in this.config.dimensions )
         rules.push( `<strong>${ this.config.dimensions[d].triggerKey }</strong>: ${d}` );

      this.view.showSurtitle( `${ rules.join(", ") }, N-back: <strong>${this.config.nBackOffset}</strong>` );
      this.view.showSubtitle( 'Press SPACE to start' );

      // Listen for keypresses
      document.addEventListener( "keydown", (e) => this.onKeyPress(e) );
   }

   /**
    * Keypress event handler
    */
   onKeyPress( e ){

      // Start game if space pressed
      if( 32 === e.keyCode && "ready" === this.gameState ) this.questionEnd();

      // Check if currently accepting user responses
      if( this.gameState !== "question" ) return;

      // Check for valid user response
      for( const d in this.config.dimensions )
         if( e.keyCode === this.config.dimensions[ d ].triggerKeyCode )
            this.onUserResponse( d );
   }

   /**
    * End game
    */
   gameEnd(){
      this.clearCurrentQuestion();
      this.gameState = "over";
      this.view.showSubtitle(
         `Game over! Score <strong>${ this.score }</strong>
         / <strong>${ this.potentialScore }</strong>`
      );
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
    * Create a new question
    */
   questionCreate(){
      const q = new Question( this.config.dimensions );
      this.questions.push( q );
      this.currentQuestion = q;
      this.gameState = "question";
      this.view.showSubtitle( `${this.round} / ${this.config.roundsPerGame}` );
      this.view.showQuestion( q );
   }

   /**
    * Clear the grid
    */
   clearCurrentQuestion(){
      this.view.showSubtitle( "" );
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
      }

      // Add to potential score
      this.potentialScore += dimensionMatches.length;

      // Query user response against current
      // question to get actual score
      for( const d in this.config.dimensions ){
         if( dimensionMatches.includes( d ) && this.response.includes( d ) ){
            this.score++;
         } else if( dimensionMatches.includes( d ) || this.response.includes( d) ){
            this.score--;
         }
      }

      this.clearCurrentQuestion();// Clear grid
      this.response = [];// Clear user response
      this.gameState = "buffer";// Set state

      setTimeout( () => this.nextQuestion(), this.config.questionBuffer );
   }

   /**
    * Create the next question
    */
   nextQuestion(){
      ++this.round;
      this.questionCreate();

      // Set timer either for buffer between
      // questions or end of the game
      if ( this.round < this.config.roundsPerGame ){
         setTimeout( () => this.questionEnd(), this.config.questionDuration );
      } else {
         setTimeout( () => this.gameEnd(), this.config.questionDuration );
      }
   }
}