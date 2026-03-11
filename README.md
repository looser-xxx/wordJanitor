# wordJanitor

A privacy-focused browser extension for grammar and spell checking.

## The Mission: Privacy First

The primary motive of wordJanitor is to provide high-quality grammar and spell checking without compromising your privacy. Most online checkers require sending your text to their servers, where it can be stored or analyzed. wordJanitor aims to keep your data under your control by prioritizing local hosting.

## Requirements

To use wordJanitor, you will need one of the following:

1.  **Local Ollama Server (Recommended for Privacy):** An Ollama server running in your network. This allows you to process all text locally without it ever leaving your environment.
2.  **Gemini API Key:** If you prefer using a cloud-based model, you can provide an API key for Google Gemini.

## Installation

### 1. Backend Dependencies

To install the necessary Python dependencies for the Flask backend, run the following commands:

```bash
# Create a virtual environment
python3 -m venv .venv

# Activate the virtual environment
source .venv/bin/activate  # On Linux/macOS
# .venv\Scripts\activate     # On Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. Browser Extension

1.  Open your Chromium-based browser (Chrome, Edge, Brave, etc.).
2.  Navigate to `chrome://extensions/`.
3.  Enable **Developer mode** in the top right corner.
4.  Click **Load unpacked** and select the `extension/` folder from this repository.
