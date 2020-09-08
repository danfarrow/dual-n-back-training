"use strict";

import DualNBack from "./DualNBack.js";

/**
 * Set everything up when ready
 */
document.addEventListener(
   "DOMContentLoaded",
   () => new DualNBack( document.getElementById( "container") )
);

