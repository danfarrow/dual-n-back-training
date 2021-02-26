"use strict";

import DualNBack from './DualNBack.js';

const userConfig = {
   // @see DualNBack.js for config option info
   nBackOffset: -2,
   questionBuffer: 100, // Milliseconds
   questionDuration: 1200, // Milliseconds
   targetRounds: 20,
   targetPotentialScore: 20,
   endOnTargetPotentialScore: true
}

/**
 * Instantiate app
 */
document.addEventListener(
   'DOMContentLoaded',
   () => new DualNBack( document.body, userConfig )
)