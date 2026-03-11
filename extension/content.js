// content.js
console.log("wordJanitor content script loaded.");

async function cleanText(textarea) {
    const originalText = textarea.value;
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
                textarea.value = response.correctedText;
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
    if (el.type === 'password' || el.readOnly || el.disabled) return;
    
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return;

    el.dataset.wordJanitorInjected = "true";

    const btn = document.createElement("button");
    btn.innerText = "✨ Clean";
    btn.className = "word-janitor-btn";
    btn.type = "button";
    
    const wrapper = document.createElement("div");
    wrapper.className = "word-janitor-wrapper";

    if (el.parentNode) {
        // Replace element with wrapper, then add button and element back
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(btn); // Added FIRST for left-side placement
        wrapper.appendChild(el);  // Added SECOND
    }

    btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        cleanText(el);
    };
}

const monitorInputs = () => {
    const inputs = document.querySelectorAll('textarea, input[type="text"], input:not([type])');
    inputs.forEach(injectButton);
};

// Initial run and recurring monitor
setTimeout(() => {
    monitorInputs();
    setInterval(monitorInputs, 3000);
}, 1000);
