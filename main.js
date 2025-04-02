/**
 * Main entry point for the VRFS Username Editor
 * Initializes all modules and sets up the application
 */

import { initUI } from './uiController.js';
import { initClipboard } from './clipboard.js';
import { hexToVRFS } from './colorUtils.js';
import { updateState } from './state.js';

/**
 * Initialize the application when the DOM is fully loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the default state with the VRFS code for #FF8E39
  const defaultVrfsCode = hexToVRFS("#FF8E39");
  updateState({ vrfsCode: defaultVrfsCode });
  
  // Initialize UI controller
  initUI();
  
  // Initialize clipboard functionality
  initClipboard();
  
  // Log initialization
  console.log("VRFS Username Editor initialized");
});
