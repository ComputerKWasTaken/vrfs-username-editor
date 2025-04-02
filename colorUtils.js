/**
 * Color utility functions for the VRFS Username Editor
 */

/**
 * Converts a hex color to RGB
 * @param {string} hex - The hex color code
 * @returns {Object} RGB color object with r, g, b properties
 */
export function hexToRGB(hex) {
  // Remove # if present
  hex = hex.replace("#", "");

  // Parse hex values to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * Converts RGB values to a hex color code
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color code
 */
export function rgbToHex(r, g, b) {
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}

/**
 * Converts a hex color to VRFS 3-digit color code
 * @param {string} hexColor - The hex color code
 * @returns {string} VRFS color code
 */
export function hexToVRFS(hexColor) {
  // Remove # if present
  hexColor = hexColor.replace("#", "");

  // Convert hex to RGB
  const rgb = hexToRGB(hexColor);
  
  // Convert RGB to VRFS 3-digit format (0-9 scale)
  // Using the formula: digit = Math.round((rgbValue / 255) * 9)
  const rDigit = Math.round((rgb.r / 255) * 9);
  const gDigit = Math.round((rgb.g / 255) * 9);
  const bDigit = Math.round((rgb.b / 255) * 9);

  // Combine digits into a 3-digit code
  return `${rDigit}${gDigit}${bDigit}`;
}
