"use strict";

import DualNBack from "./DualNBack.js";

/**
 * Set everything up when ready
 */
const userConfig = {
   // nBackOffset: -2,
   // questionBuffer: 200, // Milliseconds
   // questionDuration: 1800, // Milliseconds
   roundsPerGame: 5
}

document.addEventListener(
   "DOMContentLoaded",
   () => new DualNBack(
      document.getElementById( "container"),
      userConfig
   )
)