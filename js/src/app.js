"use strict";

import DualNBack from "./DualNBack.js";

/**
 * Set everything up when ready
 */
const userConfig = {
   // nBackOffset: -2,
   // questionBuffer: 100, // Milliseconds
   // questionDuration: 1200, // Milliseconds
   // roundsPerGame: 10
}

document.addEventListener(
   "DOMContentLoaded",
   () => new DualNBack(
      document.getElementById( "container"),
      userConfig
   )
)