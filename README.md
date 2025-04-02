# VRFS Username Color Editor

A web-based tool that allows VRFS users to customize their usernames with colors
and text styling effects.

## 🌟 Features

- **Color Selection**: Choose from preset colors or create custom colors using
  RGB sliders
- **Multi-Color Usernames**: Apply up to three distinct colors to your username
- **Draggable Color Positions**: Visually adjust where colors transition using draggable cursors in the preview area
- **Real-time Preview**: See how your username will appear in VRFS
- **Text Stylization**: Apply bold, italic, underline, small text, and highlight
  effects
- **Color Code Conversion**: Automatically converts standard hex colors to VRFS
  3-digit color format
- **Copy to Clipboard**: One-click copying of the formatted username for use in
  VRFS
- **Responsive Design**: Works on desktop and VR browsers
- **Accessibility**: Enhanced with ARIA attributes and keyboard navigation for better usability

## 🚀 Usage

1.  Enter your username in the input field.
2.  Select the **Base Color** using the presets or RGB sliders.
3.  To add more colors (up to two additional):
    *   Enable "Color 2" and/or "Color 3" using the toggle switches.
    *   Select colors for each enabled additional color slot.
    *   In the preview area below the username input, drag the colored cursors (or use arrow keys when focused) to set the position where each color transition begins. The username display will update in real-time.
4.  Apply text styling options if desired (bold, italic, etc.).
5.  View the real-time preview of how your username will appear.
6.  Copy the generated code with the "Copy to Clipboard" button.
7.  Paste the code in VRFS to apply your custom username styling.

## 📋 VRFS Color Format

This tool converts standard hexadecimal color codes to VRFS's 3-digit color
format:

- Each digit represents a color channel (R, G, B)
- Each channel is scaled from 0-9 (instead of 0-255)
- For example: `#FF0000` (bright red) converts to `900` in VRFS format

## ⚠️ Limitations

- VRFS usernames have a maximum length of 20 characters (including formatting
  tags)
- Multi-color formatting adds significant length to the username string. Be mindful of the character limit.
- A maximum of three colors (Base + 2 Additional) can be used.
- White color (999) doesn't require a color tag in VRFS
- Stylization tags won't work without a color code

## Accessibility

The application includes several accessibility features:
- **Keyboard Navigation**: All interactive elements, including color swatches, sliders, toggles, and color position cursors, are navigable and operable using a keyboard.
- **Focus Indicators**: Clear focus states are provided for all interactive elements.
- **ARIA Attributes**: Appropriate ARIA roles, states, and properties are used to enhance compatibility with screen readers and other assistive technologies.

## 🧰 Technologies Used

- HTML5
- CSS3 with Custom Properties (variables)
- Modular JavaScript (ES6 modules)
- Google Fonts (Inter, Roboto Mono, Montserrat)

## 💻 Installation

No installation required! This is a hosted web application on Netlify. If you're
interested in making changes, please send some commits and pull requests over.

## 🏗️ Project Structure

The project follows a modular architecture:

```
├── css/
│   └── styles.css         # CSS with custom properties for theming
├── js/
│   ├── colorUtils.js      # Color conversion utilities
│   ├── state.js           # Application state management
│   ├── uiController.js    # UI updates and DOM interactions
│   ├── clipboard.js       # Clipboard functionality
│   └── main.js            # Main entry point
└── index.html            # Main HTML file
```

### Module Responsibilities

- **colorUtils.js**: Handles all color conversions (hex to RGB, RGB to hex, hex to VRFS)
- **state.js**: Manages the application state with a pub/sub pattern
- **uiController.js**: Manages all DOM interactions and UI updates
- **clipboard.js**: Provides clipboard functionality with fallbacks
- **main.js**: Initializes the application and connects modules

## 👨‍💻 Created By

Tool created by computerK

---

_If you enjoy this tool, consider sending credits to ID: M-807-16_
