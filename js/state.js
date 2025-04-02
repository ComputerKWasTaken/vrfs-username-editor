/**
 * State management for the VRFS Username Editor
 */

// Default values
const initialState = {
  username: "computerK",
  // Primary color (used for the entire username or first segment)
  color: {
    r: 255,
    g: 142,
    b: 57,
    hex: "#FF8E39"
  },
  // Additional colors for multi-color feature
  additionalColors: [
    // Color 2 (empty by default)
    {
      r: 0,
      g: 255, 
      b: 0,
      hex: "#00FF00",
      enabled: false,
      position: 0 // Position in the username where this color starts (0-based index)
    },
    // Color 3 (empty by default)
    {
      r: 0,
      g: 0,
      b: 255,
      hex: "#0000FF",
      enabled: false,
      position: 0 // Position in the username where this color starts (0-based index)
    }
  ],
  stylization: {
    bold: false,
    italic: false,
    underline: false,
    small: false,
    highlight: false
  },
  vrfsCode: "952"
};

// The application state
let appState = { ...initialState };

// List of state change listeners
const listeners = [];

/**
 * Updates the application state
 * @param {Object} newState - Partial state to update
 */
export function updateState(newState) {
  // Deeply merge the state
  if (newState.color) {
    appState.color = { ...appState.color, ...newState.color };
  }
  if (newState.stylization) {
    appState.stylization = { ...appState.stylization, ...newState.stylization };
  }
  
  // Update additional colors if provided
  if (newState.additionalColors) {
    // If the entire array is provided, replace it
    if (Array.isArray(newState.additionalColors)) {
      appState.additionalColors = [...newState.additionalColors];
    } 
    // If individual color updates are provided
    else if (typeof newState.additionalColors === 'object') {
      const { index, ...updates } = newState.additionalColors;
      if (index !== undefined && appState.additionalColors[index]) {
        appState.additionalColors[index] = {
          ...appState.additionalColors[index],
          ...updates
        };
      }
    }
  }
  
  // Update simple properties
  if (newState.username !== undefined) appState.username = newState.username;
  if (newState.vrfsCode !== undefined) appState.vrfsCode = newState.vrfsCode;
  
  // Notify all listeners
  notifyListeners();
}

/**
 * Gets the current application state
 * @returns {Object} The current state
 */
export function getState() {
  return { ...appState };
}

/**
 * Resets the state to initial values
 */
export function resetState() {
  appState = { ...initialState };
  notifyListeners();
}

/**
 * Subscribe to state changes
 * @param {Function} listener - Function to call when state changes
 * @returns {Function} Unsubscribe function
 */
export function subscribe(listener) {
  listeners.push(listener);
  
  // Return unsubscribe function
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

/**
 * Notify all listeners of state changes
 */
function notifyListeners() {
  listeners.forEach(listener => listener(appState));
}
