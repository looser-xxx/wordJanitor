// background.js
const BACKEND_URL = "http://localhost:4769";

console.log("wordJanitor background service worker active.");

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "cleanText") {
        console.log("Background received cleanText request for:", request.text);

        // Perform the fetch from the background script to bypass Mixed Content blocks
        fetch(`${BACKEND_URL}/correct`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: request.text })
        })
        .then(response => response.text())
        .then(correctedText => {
            console.log("Background received corrected text:", correctedText);
            sendResponse({ success: true, correctedText: correctedText.trim() });
        })
        .catch(error => {
            console.error("Background fetch error:", error);
            sendResponse({ success: false, error: error.message });
        });

        return true; // Keep the message channel open for async response
    }
});
