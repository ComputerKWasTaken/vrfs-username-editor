/**
 * UI Controller for the VRFS Username Editor
 * Manages DOM interactions and updates
 */

import { getState, updateState, subscribe } from './state.js';
import { hexToRGB, rgbToHex, hexToVRFS } from './colorUtils.js';

// Constants
const VRFS_MAX_USERNAME_LENGTH = 20;

// Track current active color index (0 = primary, 1 = second color, 2 = third color)
let activeColorIndex = 0;

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
    highlightOption: document.getElementById("highlight-option"),
    
    // Multi-color elements
    colorTabs: document.querySelectorAll(".color-tab"),
    cursorContainer: document.getElementById("cursor-container"),
    colorCursors: document.querySelectorAll(".color-cursor"),
    usernameDisplay: document.getElementById("username-display"),
    enableColor2: document.getElementById("enable-color-2"),
    enableColor3: document.getElementById("enable-color-3")
  };
}

/**
 * Set up event listeners for user interactions
 */
function setupEventListeners() {
  // Username input
  elements.usernameInput.addEventListener("input", () => {
    const newUsername = elements.usernameInput.value;
    updateState({ username: newUsername });
    updateCursorPositionsForNewUsername(newUsername);
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
  
  // Multi-color tabs
  elements.colorTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Update active tab UI
      elements.colorTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      // Set active color index
      activeColorIndex = parseInt(tab.getAttribute("data-color-index"));
      
      // Update color controls to show the current color
      updateColorControlsForActiveColor();
    });
  });
  
  // Color position cursors (drag functionality)
  elements.colorCursors.forEach(cursor => {
    let isDragging = false;
    let containerRect;
    
    // Set initial tabindex for cursor elements
    const cursorIndex = parseInt(cursor.getAttribute('data-index'));
    const state = getState();
    const isEnabled = state.additionalColors[cursorIndex - 1].enabled;
    cursor.setAttribute('tabindex', isEnabled ? '0' : '-1');
    
    cursor.addEventListener("mousedown", (e) => {
      isDragging = true;
      containerRect = elements.cursorContainer.getBoundingClientRect();
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", stopDrag);
      e.preventDefault();
    });
    
    // Add keyboard navigation
    cursor.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        containerRect = elements.cursorContainer.getBoundingClientRect();
        
        const cursorIndex = parseInt(cursor.getAttribute("data-index"));
        const state = getState();
        const username = state.username || "computerK";
        let position = state.additionalColors[cursorIndex - 1].position;
        
        // Move left or right by 1 character
        if (e.key === "ArrowLeft" && position > 0) {
          position--;
        } else if (e.key === "ArrowRight" && position < username.length - 1) {
          position++;
        }
        
        // Update state with new position
        updateState({
          additionalColors: {
            index: cursorIndex - 1,
            position: position
          }
        });
        
        // Update the preview
        updatePreview(getState());
      }
    });
    
    function handleDrag(e) {
      if (!isDragging) return;
      
      const cursorIndex = parseInt(cursor.getAttribute("data-index"));
      const containerWidth = containerRect.width;
      
      // Calculate position as percentage of container width
      let posX = e.clientX - containerRect.left;
      posX = Math.max(0, Math.min(posX, containerWidth));
      
      // Convert to percentage of username length
      const state = getState();
      const username = state.username || "computerK";
      const position = Math.min(
        Math.round((posX / containerWidth) * username.length),
        username.length - 1
      );
      
      // Update cursor position
      cursor.style.left = `${(position / username.length) * 100}%`;
      
      // Update state with new position
      updateState({
        additionalColors: {
          index: cursorIndex - 1,
          position: position
        }
      });
      
      // Update the preview
      updatePreview(getState());
    }
    
    function stopDrag() {
      isDragging = false;
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", stopDrag);
    }
  });
  
  // Enable/disable color toggles
  elements.enableColor2.addEventListener("change", () => {
    updateState({
      additionalColors: {
        index: 0,
        enabled: elements.enableColor2.checked
      }
    });
    
    updateCursorVisibility();
    updatePreview(getState());
  });
  
  elements.enableColor3.addEventListener("change", () => {
    updateState({
      additionalColors: {
        index: 1,
        enabled: elements.enableColor3.checked
      }
    });
    
    updateCursorVisibility();
    updatePreview(getState());
  });
}

/**
 * Updates the UI based on the current state
 * @param {Object} state - The current application state
 */
export function updateUI(state) {
  // Update color controls based on active color index
  updateColorControlsForActiveColor();
  
  // Update username display for cursor positioning
  elements.usernameDisplay.textContent = state.username || "computerK";
  
  // Update cursor visibility based on enabled status
  updateCursorVisibility();
  
  // Update cursor positions
  updateCursorPositions(state);
  
  // Update preview
  updatePreview(state);
  
  // Update checkbox states for stylization
  elements.boldOption.checked = state.stylization.bold;
  elements.italicOption.checked = state.stylization.italic;
  elements.underlineOption.checked = state.stylization.underline;
  elements.smallOption.checked = state.stylization.small;
  elements.highlightOption.checked = state.stylization.highlight;
  
  // Set the enable checkboxes for additional colors
  elements.enableColor2.checked = state.additionalColors[0].enabled;
  elements.enableColor3.checked = state.additionalColors[1].enabled;
  
  // Update result code
  updateResultCode(state);
}

/**
 * Updates the color state from RGB values
 * @param {Object} rgbChanges - The RGB values to update
 */
function updateColorFromRGB(rgbChanges) {
  const state = getState();
  let newColorObj;
  
  // Determine which color to update based on active tab
  if (activeColorIndex === 0) {
    // Primary color
    const newColor = {
      r: rgbChanges.r !== undefined ? rgbChanges.r : state.color.r,
      g: rgbChanges.g !== undefined ? rgbChanges.g : state.color.g,
      b: rgbChanges.b !== undefined ? rgbChanges.b : state.color.b,
    };
    
    // Generate new hex color
    const hexColor = rgbToHex(newColor.r, newColor.g, newColor.b);
    newColor.hex = hexColor;
    
    // Update state with primary color
    updateState({ 
      color: newColor,
      vrfsCode: hexToVRFS(hexColor)
    });
  } else {
    // Additional colors (1 or 2)
    const additionalColorIndex = activeColorIndex - 1;
    const currentColor = state.additionalColors[additionalColorIndex];
    
    const newColor = {
      r: rgbChanges.r !== undefined ? rgbChanges.r : currentColor.r,
      g: rgbChanges.g !== undefined ? rgbChanges.g : currentColor.g,
      b: rgbChanges.b !== undefined ? rgbChanges.b : currentColor.b,
    };
    
    // Generate new hex color
    const hexColor = rgbToHex(newColor.r, newColor.g, newColor.b);
    newColor.hex = hexColor;
    
    // Update the cursor color to match
    if (additionalColorIndex === 0) {
      document.querySelector('.cursor-1').style.backgroundColor = hexColor;
    } else if (additionalColorIndex === 1) {
      document.querySelector('.cursor-2').style.backgroundColor = hexColor;
    }
    
    // Update state with additional color
    updateState({
      additionalColors: {
        index: additionalColorIndex,
        ...newColor,
        hex: hexColor,
        vrfsCode: hexToVRFS(hexColor)
      }
    });
  }
  
  // Remove active class from all swatches (since we're using a custom color)
  elements.colorSwatches.forEach(s => s.classList.remove("active"));
}

/**
 * Updates the color state from a hex value
 * @param {string} hexColor - The new hex color
 */
function updateColorFromHex(hexColor) {
  const rgb = hexToRGB(hexColor);
  
  // Determine which color to update based on active tab
  if (activeColorIndex === 0) {
    // Primary color
    updateState({
      color: {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        hex: hexColor
      },
      vrfsCode: hexToVRFS(hexColor)
    });
  } else {
    // Additional colors
    const additionalColorIndex = activeColorIndex - 1;
    
    // Update the cursor color to match
    if (additionalColorIndex === 0) {
      document.querySelector('.cursor-1').style.backgroundColor = hexColor;
    } else if (additionalColorIndex === 1) {
      document.querySelector('.cursor-2').style.backgroundColor = hexColor;
    }
    
    // Update state with additional color
    updateState({
      additionalColors: {
        index: additionalColorIndex,
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        hex: hexColor,
        vrfsCode: hexToVRFS(hexColor)
      }
    });
  }
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
  
  // Check for multi-color state
  let formattedUsername;
  
  if (state.additionalColors[0].enabled || state.additionalColors[1].enabled) {
    // Multi-color username
    formattedUsername = generateMultiColorUsername(state, stylizationTags);
  } else {
    // Single color username
    // Check if VRFS color code is "999" (white) - if so, don't add the color tag
    if (vrfsColorCode === "999") {
      formattedUsername = `${stylizationTags}${username}`;
    } else {
      formattedUsername = `<#${vrfsColorCode}>${stylizationTags}${username}`;
    }
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
  // Use the constant defined at the top of the file
  const maxLength = VRFS_MAX_USERNAME_LENGTH;
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

/**
 * Updates the color controls to show the active color
 */
function updateColorControlsForActiveColor() {
  const state = getState();
  
  let activeColor;
  if (activeColorIndex === 0) {
    // Primary color
    activeColor = state.color;
  } else {
    // Additional color
    activeColor = state.additionalColors[activeColorIndex - 1];
  }
  
  // Update color display
  elements.colorPreview.style.backgroundColor = activeColor.hex;
  elements.hexValue.textContent = activeColor.hex;
  elements.vrfsCode.textContent = activeColorIndex === 0 ? 
    state.vrfsCode : 
    hexToVRFS(activeColor.hex);
  
  // Update RGB slider values
  elements.redSlider.value = activeColor.r;
  elements.greenSlider.value = activeColor.g;
  elements.blueSlider.value = activeColor.b;
  elements.redValue.textContent = activeColor.r;
  elements.greenValue.textContent = activeColor.g;
  elements.blueValue.textContent = activeColor.b;
}

/**
 * Updates the cursor visibility based on enabled state
 */
function updateCursorVisibility() {
  const state = getState();
  
  // Color 2 cursor visibility
  const cursor1 = document.querySelector('.cursor-1');
  if (state.additionalColors[0].enabled) {
    cursor1.classList.add('active');
    cursor1.setAttribute('tabindex', '0'); // Make focusable when visible
  } else {
    cursor1.classList.remove('active');
    cursor1.setAttribute('tabindex', '-1'); // Not focusable when invisible
  }
  
  // Color 3 cursor visibility
  const cursor2 = document.querySelector('.cursor-2');
  if (state.additionalColors[1].enabled) {
    cursor2.classList.add('active');
    cursor2.setAttribute('tabindex', '0'); // Make focusable when visible
  } else {
    cursor2.classList.remove('active');
    cursor2.setAttribute('tabindex', '-1'); // Not focusable when invisible
  }
}

/**
 * Updates the cursor positions based on state
 */
function updateCursorPositions(state) {
  const username = state.username || "computerK";
  const usernameLength = username.length;
  
  // Update cursor positions
  state.additionalColors.forEach((color, index) => {
    const cursor = document.querySelector(`.cursor-${index + 1}`);
    
    // Set cursor background color to match the additional color
    cursor.style.backgroundColor = color.hex;
    
    // Handle zero-length username edge case
    if (usernameLength === 0) {
      cursor.style.left = '0%';
      // Update ARIA attributes for accessibility
      cursor.setAttribute('aria-valuemax', '0');
      cursor.setAttribute('aria-valuenow', '0');
    } else {
      const cursorPosition = color.position / usernameLength * 100;
      cursor.style.left = `${cursorPosition}%`;
      
      // Update ARIA attributes for accessibility
      cursor.setAttribute('aria-valuemax', usernameLength.toString());
      cursor.setAttribute('aria-valuenow', color.position.toString());
    }
  });
}

/**
 * Updates the preview with multi-color support
 */
function updatePreview(state) {
  const username = state.username || "computerK";
  
  // Check if we're using multi-color
  if (state.additionalColors[0].enabled || state.additionalColors[1].enabled) {
    // Generate colored spans for the preview
    elements.previewText.innerHTML = generateColoredPreview(state);
  } else {
    // Single color preview
    elements.previewText.textContent = username;
    elements.previewText.style.color = state.color.hex;
  }
  
  // Apply text styling
  applyPreviewStyling(state.stylization);
}

/**
 * Generates HTML for the multi-colored preview
 */
function generateColoredPreview(state) {
  const username = state.username || "computerK";
  const result = [];
  
  // Sort the colors by position
  const colors = [{ color: state.color, position: 0 }];
  
  // Add enabled additional colors
  state.additionalColors.forEach((color, index) => {
    if (color.enabled) {
      colors.push({
        color: color,
        position: color.position
      });
    }
  });
  
  // Sort by position
  colors.sort((a, b) => a.position - b.position);
  
  // Generate spans for each colored section
  for (let i = 0; i < colors.length; i++) {
    const startPos = colors[i].position;
    const endPos = i < colors.length - 1 ? colors[i + 1].position : username.length;
    
    if (endPos > startPos) {
      const section = username.substring(startPos, endPos);
      result.push(`<span style="color:${colors[i].color.hex}">${section}</span>`);
    }
  }
  
  return result.join('');
}

/**
 * Generates the VRFS code for a multi-colored username
 */
function generateMultiColorUsername(state, stylizationTags) {
  const username = state.username || "computerK";
  const result = [];
  
  // Sort the colors by position
  const colors = [{ 
    hex: state.color.hex,
    vrfsCode: state.vrfsCode,
    position: 0 
  }];
  
  // Add enabled additional colors
  state.additionalColors.forEach(color => {
    if (color.enabled) {
      colors.push({
        hex: color.hex,
        vrfsCode: hexToVRFS(color.hex),
        position: color.position
      });
    }
  });
  
  // Sort by position
  colors.sort((a, b) => a.position - b.position);
  
  // Generate the formatted username with color tags
  for (let i = 0; i < colors.length; i++) {
    const startPos = colors[i].position;
    const endPos = i < colors.length - 1 ? colors[i + 1].position : username.length;
    
    if (endPos > startPos) {
      // Add color tag
      if (colors[i].vrfsCode !== "999") { // Skip white
        result.push(`<#${colors[i].vrfsCode}>`);
      }
      
      // Add stylization tags only for the first segment
      if (i === 0) {
        result.push(stylizationTags);
      }
      
      // Add this section of the username
      const section = username.substring(startPos, endPos);
      result.push(section);
    }
  }
  
  return result.join('');
}

/**
 * Updates cursor positions when username changes
 */
function updateCursorPositionsForNewUsername(newUsername) {
  const state = getState();
  const usernameLength = newUsername.length || 1;
  
  // Adjust cursor positions to be valid for the new username length
  state.additionalColors.forEach((color, index) => {
    if (color.position >= usernameLength) {
      // If position is beyond the new username length, adjust it
      updateState({
        additionalColors: {
          index: index,
          // Add clamping to prevent negative positions
          position: Math.max(0, usernameLength - 1)
        }
      });
    }
  });
  
  // Update cursor positions in the UI
  updateCursorPositions(getState());
}
