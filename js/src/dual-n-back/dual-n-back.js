"use strict";

import Question from "./Question.js";
import View from "./View.js";

/**
 * * Start game
 * * While remainingQuestions > 0:
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
 * @todo Blank grid buffer between questions
 */
global.NBACK = (function() {
   let api = {},
      dimensions = {
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
      currentQuestion,
      gameState = "ready",// "ready", "question", "buffer", "over"
      nBackOffset = -2,
      potentialScore = 0,
      questionBuffer = 200, // Milliseconds
      questionDuration = 1800, // Milliseconds
      questions = [],// Array of questions in current/last round
      response = [],// Holds user response while question is active
      round = 0,
      roundsPerGame = 20,
      score = 0,
      view;

   // API: Set everything up
   api.init = function( elem ){
      // Create view
      view = new View( elem, dimensions, nBackOffset );

      // Populate captions
      const rules = [];

      for( const d in dimensions )
         rules.push( `<strong>${ dimensions[d].triggerKey }</strong>: ${d}` );

      view.showSurtitle( `${ rules.join(", ") }, N-back: <strong>${nBackOffset}</strong>` );
      view.showSubtitle( 'Press SPACE to start' );

      // Listen for keypresses
      document.addEventListener( "keydown", (e) => onKeyPress(e) );
   }

   /**
    * Keypress event handler
    */
   const onKeyPress = function( e ){

      // Start game if space pressed
      if( 32 === e.keyCode && "ready" === gameState ) questionEnd();

      // Check if currently accepting user responses
      if( gameState !== "question" ) return;

      // Check for valid user response
      for( const d in dimensions )
         if( e.keyCode === dimensions[ d ].triggerKeyCode )
            onUserResponse( d );
   }

   /**
    * End game
    */
   const gameEnd = function(){
      clearCurrentQuestion();
      gameState = "over";
      view.showSubtitle(
         `Game over! Score <strong>${ score }</strong>
         / <strong>${ potentialScore }</strong>`
      );
   }

   /**
    * User has responded with dimension d - update response
    */
   const onUserResponse = function( d ){
      if( response.indexOf( d ) !== -1 ) return;

      // Response is not already registered so add to responses
      response.push( d );
   }

   /**
    * Create a new question
    */
   const questionCreate = function(){
      const q = new Question( dimensions );
      questions.push( q );
      currentQuestion = q;
      gameState = "question";
      view.showSubtitle( `${round} / ${roundsPerGame}` );
      view.showQuestion( q );
   }

   /**
    * Clear the grid
    */
   const clearCurrentQuestion = function(){
      view.showSubtitle( "" );
      if( !currentQuestion ) return;
      view.removeQuestion( currentQuestion );
      currentQuestion = null;
   }

   /**
    * End the current question, set timeout for next
    */
   const questionEnd = function(){
      // Compare current question with nth-back
      // to get dimension intersection
      const currentIndex = questions.length - 1,
         nBackIndex = currentIndex + nBackOffset;

      let dimensionMatches = [];

      if( nBackIndex >= 0 ){
         const nBackthQuestion = questions[ nBackIndex ];
         dimensionMatches = currentQuestion.compare( nBackthQuestion );
      }

      // Add to potential score
      potentialScore += dimensionMatches.length;

      // Query user response against current
      // question to get actual score
      for( const d in dimensions ){
         if( dimensionMatches.includes( d ) && response.includes( d ) ){
            score++;
         } else if( dimensionMatches.includes( d ) || response.includes( d) ){
            score--;
         }
      }

      clearCurrentQuestion();// Clear grid
      response = [];// Clear user response

      // Set state
      gameState = "buffer";


      setTimeout( nextQuestion, questionBuffer );
   }

   /**
    * Create the next question
    */
   const nextQuestion = function(){
      ++round;
      questionCreate();

      // Set timer either for buffer between
      // questions or end of the game
      if ( round < roundsPerGame ){
         setTimeout( questionEnd, questionDuration );
      } else {
         setTimeout( gameEnd, questionDuration );
      }
   }

   // Done
   return api;

})();