/**
 * Clipboard functionality for the VRFS Username Editor
 */

// DOM Elements
let resultCodeElement;
let copyButton;
let thankYouPopup;
let closePopupBtn;

/**
 * Initializes the clipboard functionality
 */
export function initClipboard() {
  // Cache DOM elements
  resultCodeElement = document.getElementById("result-code");
  copyButton = document.getElementById("copy-button");
  thankYouPopup = document.getElementById("thank-you-popup");
  closePopupBtn = document.getElementById("close-popup");
  
  // Set up event listeners
  copyButton.addEventListener("click", copyToClipboard);
  closePopupBtn.addEventListener("click", () => {
    thankYouPopup.classList.remove("show");
  });
}

/**
 * Copies the result code to the clipboard
 */
function copyToClipboard() {
  const textToCopy = resultCodeElement.textContent;
  
  // More robust clipboard copy method with fallbacks
  const copyText = async () => {
    try {
      // Try the modern clipboard API first
      await navigator.clipboard.writeText(textToCopy);
      return true;
    } catch (err) {
      console.warn("Clipboard API failed, trying fallback method:", err);
      
      try {
        // Fallback method using document.execCommand
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        
        // Make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        const success = document.execCommand("copy");
        document.body.removeChild(textArea);
        
        if (!success) throw new Error("execCommand copy failed");
        return true;
      } catch (fallbackErr) {
        console.error("Fallback clipboard method failed:", fallbackErr);
        return false;
      }
    }
  };

  // Execute the copy operation
  copyText().then(success => {
    if (success) {
      // Visual feedback for successful copy
      const originalText = copyButton.textContent;
      copyButton.textContent = "Copied!";

      // Show the thank you popup after a short delay
      setTimeout(() => {
        thankYouPopup.classList.add("show");
      }, 500);

      setTimeout(() => {
        copyButton.textContent = originalText;
      }, 2000);
    } else {
      alert("Failed to copy to clipboard. Please try again or copy manually.");
    }
  });
}
