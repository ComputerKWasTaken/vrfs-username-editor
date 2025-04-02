/**
 * UI Controller for the VRFS Username Editor
 * Manages DOM interactions and updates
 */

import { getState, updateState, subscribe } from './state.js';
import { hexToRGB, rgbToHex, hexToVRFS } from './colorUtils.js';

// DOM Element references
let elements = {};

/**
 * Initializes the UI controller
 */
export function initUI() {
  // Cache DOM elements
  cacheElements();
  
  // Set up event listeners
  setupEventListeners();
  
  // Subscribe to state changes
  subscribe(updateUI);
  
  // Initialize UI with current state
  updateUI(getState());
  
  // Set initial active color swatch
  setInitialActiveSwatch();
}

/**
 * Cache DOM elements for better performance
 */
function cacheElements() {
  elements = {
    // Input elements
    usernameInput: document.getElementById("username"),
    redSlider: document.getElementById("red-slider"),
    greenSlider: document.getElementById("green-slider"),
    blueSlider: document.getElementById("blue-slider"),
    
    // Display elements
    colorPreview: document.getElementById("color-preview"),
    hexValue: document.getElementById("hex-value"),
    vrfsCode: document.getElementById("vrfs-code"),
    redValue: document.getElementById("red-value"),
    greenValue: document.getElementById("green-value"),
    blueValue: document.getElementById("blue-value"),
    previewText: document.getElementById("preview-text"),
    resultCode: document.getElementById("result-code"),
    
    // Interactive elements
    colorSwatches: document.querySelectorAll(".color-swatch"),
    stylizationOptions: document.querySelectorAll(".style-checkbox"),
    
    // Stylization checkboxes
    boldOption: document.getElementById("bold-option"),
    italicOption: document.getElementById("italic-option"),
    underlineOption: document.getElementById("underline-option"),
    smallOption: document.getElementById("small-option"),
    highlightOption: document.getElementById("highlight-option")
  };
}

/**
 * Set up event listeners for user interactions
 */
function setupEventListeners() {
  // Username input
  elements.usernameInput.addEventListener("input", () => {
    updateState({ username: elements.usernameInput.value });
  });
  
  // RGB sliders
  elements.redSlider.addEventListener("input", () => {
    const value = parseInt(elements.redSlider.value);
    updateColorFromRGB({ r: value });
  });
  
  elements.greenSlider.addEventListener("input", () => {
    const value = parseInt(elements.greenSlider.value);
    updateColorFromRGB({ g: value });
  });
  
  elements.blueSlider.addEventListener("input", () => {
    const value = parseInt(elements.blueSlider.value);
    updateColorFromRGB({ b: value });
  });
  
  // Color swatches
  elements.colorSwatches.forEach(swatch => {
    swatch.addEventListener("click", () => {
      const hexColor = swatch.getAttribute("data-color");
      updateColorFromHex(hexColor);
      
      // Set active swatch
      elements.colorSwatches.forEach(s => s.classList.remove("active"));
      swatch.classList.add("active");
    });
    
    // Keyboard accessibility
    swatch.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        swatch.click();
      }
    });
  });
  
  // Stylization options
  elements.stylizationOptions.forEach(option => {
    option.addEventListener("change", updateStylizationOptions);
  });
}

/**
 * Updates the UI based on the current state
 * @param {Object} state - The current application state
 */
export function updateUI(state) {
  // Update color display
  elements.colorPreview.style.backgroundColor = state.color.hex;
  elements.hexValue.textContent = state.color.hex;
  elements.vrfsCode.textContent = state.vrfsCode;
  
  // Update RGB slider values
  elements.redSlider.value = state.color.r;
  elements.greenSlider.value = state.color.g;
  elements.blueSlider.value = state.color.b;
  elements.redValue.textContent = state.color.r;
  elements.greenValue.textContent = state.color.g;
  elements.blueValue.textContent = state.color.b;
  
  // Update preview text
  elements.previewText.textContent = state.username || "computerK";
  elements.previewText.style.color = state.color.hex;
  
  // Apply text styling
  applyPreviewStyling(state.stylization);
  
  // Update checkbox states
  elements.boldOption.checked = state.stylization.bold;
  elements.italicOption.checked = state.stylization.italic;
  elements.underlineOption.checked = state.stylization.underline;
  elements.smallOption.checked = state.stylization.small;
  elements.highlightOption.checked = state.stylization.highlight;
  
  // Update result code
  updateResultCode(state);
}

/**
 * Updates the color state from RGB values
 * @param {Object} rgbChanges - The RGB values to update
 */
function updateColorFromRGB(rgbChanges) {
  const state = getState();
  const newColor = {
    r: rgbChanges.r !== undefined ? rgbChanges.r : state.color.r,
    g: rgbChanges.g !== undefined ? rgbChanges.g : state.color.g,
    b: rgbChanges.b !== undefined ? rgbChanges.b : state.color.b,
  };
  
  // Generate new hex color
  const hexColor = rgbToHex(newColor.r, newColor.g, newColor.b);
  newColor.hex = hexColor;
  
  // Update state
  updateState({ 
    color: newColor,
    vrfsCode: hexToVRFS(hexColor)
  });
  
  // Remove active class from all swatches (since we're using a custom color)
  elements.colorSwatches.forEach(s => s.classList.remove("active"));
}

/**
 * Updates the color state from a hex value
 * @param {string} hexColor - The new hex color
 */
function updateColorFromHex(hexColor) {
  const rgb = hexToRGB(hexColor);
  
  // Update state
  updateState({
    color: {
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
      hex: hexColor
    },
    vrfsCode: hexToVRFS(hexColor)
  });
}

/**
 * Updates the stylization options in the state
 */
function updateStylizationOptions() {
  const stylization = {
    bold: elements.boldOption.checked,
    italic: elements.italicOption.checked,
    underline: elements.underlineOption.checked,
    small: elements.smallOption.checked,
    highlight: elements.highlightOption.checked
  };
  
  updateState({ stylization });
}

/**
 * Applies CSS classes for preview styling
 * @param {Object} stylization - The current stylization options
 */
function applyPreviewStyling(stylization) {
  // Reset all styles
  elements.previewText.classList.remove(
    "preview-bold", 
    "preview-italic", 
    "preview-underline", 
    "preview-small", 
    "preview-highlight"
  );

  // Apply current styles
  if (stylization.bold) elements.previewText.classList.add("preview-bold");
  if (stylization.italic) elements.previewText.classList.add("preview-italic");
  if (stylization.underline) elements.previewText.classList.add("preview-underline");
  if (stylization.small) elements.previewText.classList.add("preview-small");
  if (stylization.highlight) elements.previewText.classList.add("preview-highlight");
}

/**
 * Updates the result code based on current state
 * @param {Object} state - The current application state
 */
function updateResultCode(state) {
  const username = state.username || "computerK";
  const vrfsColorCode = state.vrfsCode;
  
  // Get stylization tags
  const stylizationTags = getStylizationTags(state.stylization);
  
  // Check if VRFS color code is "999" (white) - if so, don't add the color tag
  let formattedUsername;
  if (vrfsColorCode === "999") {
    formattedUsername = `${stylizationTags}${username}`;
  } else {
    formattedUsername = `<#${vrfsColorCode}>${stylizationTags}${username}`;
  }
  
  elements.resultCode.textContent = formattedUsername;
  
  // Check username length (maximum 20 characters allowed in VRFS)
  checkUsernameLength(formattedUsername);
}

/**
 * Generates HTML tags for stylization
 * @param {Object} stylization - The stylization options
 * @returns {string} The HTML tags for stylization
 */
function getStylizationTags(stylization) {
  let tags = "";

  if (stylization.bold) tags += "<b>";
  if (stylization.italic) tags += "<i>";
  if (stylization.underline) tags += "<u>";
  if (stylization.small) tags += "<sub>";
  if (stylization.highlight) tags += "<mark>";

  return tags;
}

/**
 * Checks username length and shows warnings if needed
 * @param {string} formattedUsername - The formatted username with tags
 */
function checkUsernameLength(formattedUsername) {
  const maxLength = 20;
  const totalLength = formattedUsername.length;
  
  // Get or create the warning element
  let warningElement = document.getElementById("length-warning");
  if (!warningElement) {
    warningElement = document.createElement("div");
    warningElement.id = "length-warning";
    document.querySelector(".result-box").appendChild(warningElement);
  }

  // Initialize warnings array to collect all warnings
  let warnings = [];
  
  // Check if there are stylization tags without a given color code (when vrfsColorCode is 999)
  const state = getState();
  if (state.vrfsCode === "999" && hasStylization(state.stylization)) {
    warnings.push("Color code is missing. Stylization tags will not work.");
  }
  
  // Add length warning if needed
  if (totalLength > maxLength) {
    warnings.push(`Username exceeds maximum length (${totalLength}/${maxLength} characters)`);
  }
  
  // Display all warnings or clear if none
  if (warnings.length > 0) {
    warningElement.innerHTML = warnings.map(warning => `Warning: ${warning}`).join('<br>');
    warningElement.classList.add("length-warning-active");
  } else {
    warningElement.textContent = "";
    warningElement.classList.remove("length-warning-active");
  }
}

/**
 * Checks if any stylization option is enabled
 * @param {Object} stylization - The stylization options
 * @returns {boolean} True if any stylization is enabled
 */
function hasStylization(stylization) {
  return Object.values(stylization).some(value => value === true);
}

/**
 * Sets the initial active swatch based on the default color
 */
function setInitialActiveSwatch() {
  const state = getState();
  const defaultHex = state.color.hex.toUpperCase();
  
  elements.colorSwatches.forEach(swatch => {
    const swatchColor = swatch.getAttribute("data-color").toUpperCase();
    if (swatchColor === defaultHex) {
      swatch.classList.add("active");
    }
  });
  
  // Set tab index for better keyboard navigation
  elements.colorSwatches.forEach((swatch, index) => {
    swatch.setAttribute("tabindex", index + 1);
  });
}
