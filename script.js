document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
    const usernameInput = document.getElementById("username");
    const hexValue = document.getElementById("hex-value");
    const vrfsCode = document.getElementById("vrfs-code");
    const previewText = document.getElementById("preview-text");
    const resultCode = document.getElementById("result-code");
    const copyButton = document.getElementById("copy-button");
    const colorPreview = document.getElementById("color-preview");

    // RGB slider elements
    const redSlider = document.getElementById("red-slider");
    const greenSlider = document.getElementById("green-slider");
    const blueSlider = document.getElementById("blue-slider");
    const redValue = document.getElementById("red-value");
    const greenValue = document.getElementById("green-value");
    const blueValue = document.getElementById("blue-value");

    // Color swatches
    const colorSwatches = document.querySelectorAll(".color-swatch");

    // Stylization options
    const boldOption = document.getElementById("bold-option");
    const italicOption = document.getElementById("italic-option");
    const underlineOption = document.getElementById("underline-option");
    const smallOption = document.getElementById("small-option");
    const highlightOption = document.getElementById("highlight-option");
    const stylizationOptions = document.querySelectorAll(".style-checkbox");

    // Current color values
    let currentColor = {
      r: 255,
      g: 142,
      b: 57,
      hex: "#FF8E39"
    };

    // Current stylization options
    let currentStylization = {
      bold: false,
      italic: false,
      underline: false,
      small: false,
      highlight: false
    };

    // Initialize with default values
    updatePreview();

    // Event listeners
    usernameInput.addEventListener("input", updatePreview);

    // RGB slider events
    redSlider.addEventListener("input", () => {
      currentColor.r = parseInt(redSlider.value);
      redValue.textContent = currentColor.r;
      updateColorFromRGB();
    });

    greenSlider.addEventListener("input", () => {
      currentColor.g = parseInt(greenSlider.value);
      greenValue.textContent = currentColor.g;
      updateColorFromRGB();
    });

    blueSlider.addEventListener("input", () => {
      currentColor.b = parseInt(blueSlider.value);
      blueValue.textContent = currentColor.b;
      updateColorFromRGB();
    });

    // Color swatch events
    colorSwatches.forEach((swatch) => {
      swatch.addEventListener("click", () => {
        // Remove active class from all swatches
        colorSwatches.forEach((s) => s.classList.remove("active"));

        // Add active class to clicked swatch
        swatch.classList.add("active");

        // Get color from data attribute
        const hexColor = swatch.getAttribute("data-color");
        updateColorFromHex(hexColor);
      });

      // Add keyboard accessibility
      swatch.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          swatch.click();
        }
      });
    });

    // Stylization option events
    stylizationOptions.forEach(option => {
      option.addEventListener("change", updateStylization);
    });

    // Function to update stylization options
    function updateStylization() {
      currentStylization.bold = boldOption.checked;
      currentStylization.italic = italicOption.checked;
      currentStylization.underline = underlineOption.checked;
      currentStylization.small = smallOption.checked;
      currentStylization.highlight = highlightOption.checked;

      updatePreview();
    }

    copyButton.addEventListener("click", copyToClipboard);

    // Function to convert hex to RGB
    function hexToRGB(hex) {
      // Remove # if present
      hex = hex.replace("#", "");

      // Parse hex values to RGB
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      return { r, g, b };
    }

    // Function to convert RGB to hex
    function rgbToHex(r, g, b) {
      return (
        "#" +
        ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
      );
    }

    // Function to convert hex to VRFS 3-digit color code
    function hexToVRFS(hexColor) {
      // Remove # if present
      hexColor = hexColor.replace("#", "");

      // Convert hex to RGB
      const r = parseInt(hexColor.substring(0, 2), 16);
      const g = parseInt(hexColor.substring(2, 4), 16);
      const b = parseInt(hexColor.substring(4, 6), 16);

      // Convert RGB to VRFS 3-digit format (0-9 scale)
      // Using the formula: digit = Math.round((rgbValue / 255) * 9)
      const rDigit = Math.round((r / 255) * 9);
      const gDigit = Math.round((g / 255) * 9);
      const bDigit = Math.round((b / 255) * 9);

      // Combine digits into a 3-digit code
      return `${rDigit}${gDigit}${bDigit}`;
    }

    // Function to update color from RGB values
    function updateColorFromRGB() {
      // Update hex value
      currentColor.hex = rgbToHex(currentColor.r, currentColor.g, currentColor.b);

      // Update UI
      hexValue.textContent = currentColor.hex;
      colorPreview.style.backgroundColor = currentColor.hex;

      // Update VRFS code
      const vrfsColorCode = hexToVRFS(currentColor.hex);
      vrfsCode.textContent = vrfsColorCode;

      // Update preview
      updatePreview();

      // Remove active class from all swatches (since we're using a custom color)
      colorSwatches.forEach((s) => s.classList.remove("active"));
    }

    // Function to update color from hex value
    function updateColorFromHex(hexColor) {
      // Update current color
      currentColor.hex = hexColor;
      const rgb = hexToRGB(hexColor);
      currentColor.r = rgb.r;
      currentColor.g = rgb.g;
      currentColor.b = rgb.b;

      // Update sliders
      redSlider.value = currentColor.r;
      greenSlider.value = currentColor.g;
      blueSlider.value = currentColor.b;

      // Update value displays
      redValue.textContent = currentColor.r;
      greenValue.textContent = currentColor.g;
      blueValue.textContent = currentColor.b;

      // Update hex display
      hexValue.textContent = currentColor.hex;

      // Update color preview
      colorPreview.style.backgroundColor = currentColor.hex;

      // Update VRFS code
      const vrfsColorCode = hexToVRFS(currentColor.hex);
      vrfsCode.textContent = vrfsColorCode;

      // Update preview
      updatePreview();
    }

    // Function to get stylization tags
    function getStylizationTags() {
      let tags = "";

      if (currentStylization.bold) tags += "<b>";
      if (currentStylization.italic) tags += "<i>";
      if (currentStylization.underline) tags += "<u>";
      if (currentStylization.small) tags += "<sub>";
      if (currentStylization.highlight) tags += "<mark>";

      return tags;
    }

    // Function to apply preview styling
    function applyPreviewStyling() {
      // Reset all styles
      previewText.classList.remove("preview-bold", "preview-italic", "preview-underline", "preview-small", "preview-highlight");

      // Apply current styles
      if (currentStylization.bold) previewText.classList.add("preview-bold");
      if (currentStylization.italic) previewText.classList.add("preview-italic");
      if (currentStylization.underline) previewText.classList.add("preview-underline");
      if (currentStylization.small) previewText.classList.add("preview-small");
      if (currentStylization.highlight) previewText.classList.add("preview-highlight");
    }

    // Function to update the preview
    function updatePreview() {
      const username = usernameInput.value || "computerK";
      const vrfsColorCode = vrfsCode.textContent;

      // Apply styling to preview
      previewText.textContent = username;
      previewText.style.color = currentColor.hex;
      applyPreviewStyling();

      // Get stylization tags
      const stylizationTags = getStylizationTags();

      // Check if VRFS color code is "999" (white) - if so, don't add the color tag
      let formattedUsername;
      if (vrfsColorCode === "999") {
        formattedUsername = `${stylizationTags}${username}`;
      } else {
        formattedUsername = `<#${vrfsColorCode}>${stylizationTags}${username}`;
      }
      
      resultCode.textContent = formattedUsername;
      
      // Check username length (maximum 20 characters allowed in VRFS)
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
      if (vrfsColorCode === "999" && stylizationTags) {
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

    // Function to copy result to clipboard
    function copyToClipboard() {
      const textToCopy = resultCode.textContent;
      const thankYouPopup = document.getElementById("thank-you-popup");
      const closePopupBtn = document.getElementById("close-popup");

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

          // Event listener for closing the popup
          closePopupBtn.addEventListener("click", () => {
            thankYouPopup.classList.remove("show");
          });

          setTimeout(() => {
            copyButton.textContent = originalText;
          }, 2000);
        } else {
          alert("Failed to copy to clipboard. Please try again or copy manually.");
        }
      });
    }

    // Set initial color (FF8E39)
    updateColorFromHex("#FF8E39");

    // Set tab index for better keyboard navigation
    colorSwatches.forEach((swatch, index) => {
      swatch.setAttribute("tabindex", index + 1);
    });
  });