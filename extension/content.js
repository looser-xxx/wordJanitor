// content.js
console.log("wordJanitor content script loaded.");

async function cleanText(textarea) {
    const isContentEditable = textarea.contentEditable === 'true';
    const originalText = isContentEditable ? textarea.innerText : textarea.value;
    
    if (!originalText || !originalText.trim()) return;

    try {
        textarea.disabled = true;
        textarea.style.opacity = "0.7";
        
        chrome.runtime.sendMessage({ action: "cleanText", text: originalText }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Runtime error:", chrome.runtime.lastError);
                textarea.disabled = false;
                textarea.style.opacity = "1";
                return;
            }

            if (response && response.success) {
                if (isContentEditable) {
                    textarea.innerText = response.correctedText;
                } else {
                    textarea.value = response.correctedText;
                }
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
            }
            
            textarea.disabled = false;
            textarea.style.opacity = "1";
        });

    } catch (error) {
        console.error("Error in cleanText:", error);
        textarea.disabled = false;
        textarea.style.opacity = "1";
    }
}

function injectButton(el) {
    // Check if the extension is enabled
    chrome.storage.local.get(['isEnabled'], (result) => {
        const isEnabled = result.isEnabled !== false; // Default to true

        // Find the wrapper if it already exists
        const wrapper = el.closest('.word-janitor-wrapper');
        const btn = wrapper ? wrapper.querySelector('.word-janitor-btn') : null;

        if (!isEnabled) {
            // Hide the button if it's already there
            if (btn) btn.style.display = "none";
            return;
        }

        // Extension IS enabled
        if (el.dataset.wordJanitorInjected === "true") {
            if (btn) btn.style.display = "flex";
            return;
        }

        // Filter valid elements
        const isContentEditable = el.contentEditable === 'true';
        const isTextInput = (el.tagName === 'TEXTAREA' || 
                            (el.tagName === 'INPUT' && ['text', 'search', 'email', 'url'].includes(el.type)) ||
                            el.tagName === 'DIV' && isContentEditable);
                            
        if (!isTextInput || el.type === 'password' || el.readOnly || el.disabled) return;
        
        const hasText = (isContentEditable ? el.innerText : el.value).trim().length > 0;
        const isFocused = document.activeElement === el;

        if (!hasText && !isFocused) return;

        // Injecting
        el.dataset.wordJanitorInjected = "true";
        const newBtn = document.createElement("button");
        newBtn.innerText = "✨ Clean";
        newBtn.className = "word-janitor-btn";
        newBtn.type = "button";
        
        const newWrapper = document.createElement("div");
        newWrapper.className = "word-janitor-wrapper";

        if (el.parentNode) {
            el.parentNode.insertBefore(newWrapper, el);
            newWrapper.appendChild(newBtn);
            newWrapper.appendChild(el);
        }

        newBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            cleanText(el);
        };
    });
}

const monitorInputs = () => {
    const potentialInputs = document.querySelectorAll('textarea, input, [contenteditable="true"]');
    potentialInputs.forEach(injectButton);
};

monitorInputs();
setInterval(monitorInputs, 1500);

document.addEventListener('focusin', (e) => {
    injectButton(e.target);
}, true);
