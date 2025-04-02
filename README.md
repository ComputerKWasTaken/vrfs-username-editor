# VRFS Username Color Editor

A web-based tool that allows VRFS users to customize their usernames with colors
and text styling effects.

## 🌟 Features

- **Color Selection**: Choose from preset colors or create custom colors using
  RGB sliders
- **Real-time Preview**: See how your username will appear in VRFS
- **Text Stylization**: Apply bold, italic, underline, small text, and highlight
  effects
- **Color Code Conversion**: Automatically converts standard hex colors to VRFS
  3-digit color format
- **Copy to Clipboard**: One-click copying of the formatted username for use in
  VRFS
- **Responsive Design**: Works on desktop and VR browsers

## 🚀 Usage

1. Enter your username in the input field
2. Select a color using either:
   - The preset color swatches
   - The RGB sliders for fine-tuning
3. Apply text styling options if desired (bold, italic, etc.)
4. View the real-time preview of how your username will appear
5. Copy the generated code with the "Copy to Clipboard" button
6. Paste the code in VRFS to apply your custom username styling

## 📋 VRFS Color Format

This tool converts standard hexadecimal color codes to VRFS's 3-digit color
format:

- Each digit represents a color channel (R, G, B)
- Each channel is scaled from 0-9 (instead of 0-255)
- For example: `#FF0000` (bright red) converts to `900` in VRFS format

## ⚠️ Limitations

- VRFS usernames have a maximum length of 20 characters (including formatting
  tags)
- White color (999) doesn't require a color tag in VRFS
- Stylization tags won't work without a color code

## 🧰 Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Google Fonts (Inter, Roboto Mono, Montserrat)

## 💻 Installation

No installation required! This is a hosted web application on Netlify. If you're
interested in making changes, please send some commits and pull requests over.

## 👨‍💻 Created By

Tool created by computerK

---

_If you enjoy this tool, consider sending credits to ID: M-807-16_
