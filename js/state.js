/**
 * State management for the VRFS Username Editor
 */

// Default values
const initialState = {
  username: "computerK",
  color: {
    r: 255,
    g: 142,
    b: 57,
    hex: "#FF8E39"
  },
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
