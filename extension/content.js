// content.js
console.log("wordJanitor content script loaded.");

async function cleanText(textarea) {
    // Handle both regular inputs and contenteditable divs
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
    if (el.dataset.wordJanitorInjected === "true") return;
    
    // Check if it's a valid text input or contenteditable
    const isContentEditable = el.contentEditable === 'true';
    const isTextInput = (el.tagName === 'TEXTAREA' || 
                        (el.tagName === 'INPUT' && ['text', 'search', 'email', 'url'].includes(el.type)) ||
                        el.tagName === 'DIV' && isContentEditable);
                        
    if (!isTextInput || el.type === 'password' || el.readOnly || el.disabled) return;
    
    // Check if the element has text OR is focused
    const hasText = (isContentEditable ? el.innerText : el.value).trim().length > 0;
    const isFocused = document.activeElement === el;

    if (!hasText && !isFocused) return;

    // Once we decide to inject, mark it
    el.dataset.wordJanitorInjected = "true";

    const btn = document.createElement("button");
    btn.innerText = "✨ Clean";
    btn.className = "word-janitor-btn";
    btn.type = "button";
    
    const wrapper = document.createElement("div");
    wrapper.className = "word-janitor-wrapper";

    if (el.parentNode) {
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(btn);
        wrapper.appendChild(el);
    }

    btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        cleanText(el);
    };
}

const monitorInputs = () => {
    // Broad selector for potential text areas
    const potentialInputs = document.querySelectorAll('textarea, input, [contenteditable="true"]');
    potentialInputs.forEach(injectButton);
};

// Faster monitoring to be more responsive
setTimeout(() => {
    monitorInputs();
    setInterval(monitorInputs, 1500);
}, 500);

// Also listen for focus events to inject buttons immediately
document.addEventListener('focusin', (e) => {
    injectButton(e.target);
}, true);
