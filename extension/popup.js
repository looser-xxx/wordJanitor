document.addEventListener('DOMContentLoaded', () => {
    const activateBtn = document.getElementById('activate-btn');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.querySelector('.status-text');

    console.log("wordJanitor popup loaded with background polling.");

    function setStatus(isOnline) {
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

    // Function to check the /ready endpoint
    async function checkServer() {
        try {
            const response = await fetch('http://localhost:4769/ready');
            const text = await response.text();
            
            if (text.trim() === 'Yoo') {
                setStatus(true);
            } else {
                console.warn("Server responded but not with 'Yoo':", text);
                setStatus(false);
            }
        } catch (err) {
            console.log("Server unreachable");
            setStatus(false);
        }
    }

    // Run immediately on load
    checkServer();

    // Set up polling interval (every 5 seconds)
    const pollInterval = setInterval(checkServer, 5000);

    // Clean up interval when popup closes (optional but good practice)
    window.addEventListener('unload', () => {
        clearInterval(pollInterval);
    });

    // Handle "Activate" click (Manual check)
    activateBtn.addEventListener('click', () => {
        console.log("Manual activation check...");
        checkServer();
        
        // Provide click feedback
        const originalText = activateBtn.innerText;
        activateBtn.innerText = 'Checking...';
        setTimeout(() => {
            activateBtn.innerText = originalText;
        }, 1000);
    });
});
