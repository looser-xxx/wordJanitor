document.addEventListener('DOMContentLoaded', () => {
    const activateBtn = document.getElementById('activate-btn');
    const deactivateBtn = document.getElementById('deactivate-btn');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.querySelector('.status-text');

    console.log("wordJanitor popup loaded.");

    function setStatus(isOnline, isEnabled = true) {
        if (!isEnabled) {
            statusDot.classList.remove('status-online');
            statusDot.classList.add('status-offline');
            activateBtn.classList.remove('active-state');
            if (statusText) statusText.innerText = "wordJanitor: Disabled";
            return;
        }

        if (isOnline) {
            statusDot.classList.remove('status-offline');
            statusDot.classList.add('status-online');
            activateBtn.classList.add('active-state');
            if (statusText) statusText.innerText = "Server: Online (Ollama)";
        } else {
            statusDot.classList.remove('status-online');
            statusDot.classList.add('status-offline');
            activateBtn.classList.remove('active-state');
            if (statusText) statusText.innerText = "Server: Offline";
        }
    }

    async function checkServer() {
        chrome.storage.local.get(['isEnabled'], async (result) => {
            const isEnabled = result.isEnabled !== false; // Default to true
            if (!isEnabled) {
                setStatus(false, false);
                return;
            }

            try {
                const response = await fetch('http://localhost:4769/ready');
                const text = await response.text();
                setStatus(text.trim() === 'Yoo', true);
            } catch (err) {
                setStatus(false, true);
            }
        });
    }

    checkServer();
    setInterval(checkServer, 5000);

    activateBtn.addEventListener('click', () => {
        chrome.storage.local.set({ isEnabled: true }, () => {
            console.log("Activating wordJanitor...");
            checkServer();
        });
    });

    deactivateBtn.addEventListener('click', () => {
        chrome.storage.local.set({ isEnabled: false }, () => {
            console.log("Deactivating wordJanitor...");
            setStatus(false, false);
            // Alert user visually
            const originalText = deactivateBtn.innerText;
            deactivateBtn.innerText = 'Disabled';
            setTimeout(() => deactivateBtn.innerText = originalText, 1000);
        });
    });
});
