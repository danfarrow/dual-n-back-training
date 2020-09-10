"use strict";

import DualNBack from "./DualNBack.js";

/**
 * Set everything up when ready
 */
const userConfig = {
   nBackOffset: -2,
   questionBuffer: 100, // Milliseconds
   questionDuration: 1200, // Milliseconds
   targetRounds: 3,
   targetPotentialScore: 20,
   endOnTargetPotentialScore: false // End game on targetScore | targetRounds
}

document.addEventListener(
   "DOMContentLoaded",
   () => new DualNBack(
      document.getElementById( "container"),
      userConfig
   )
)