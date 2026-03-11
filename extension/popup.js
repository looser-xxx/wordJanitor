document.addEventListener('DOMContentLoaded', () => {
    const activateBtn = document.getElementById('activate-btn');
    const statusDot = document.getElementById('status-dot');

    console.log("wordJanitor popup loaded with Ollama as default.");

    // Handle "Activate" click
    activateBtn.addEventListener('click', () => {
        const selectedProvider = 'ollama'; // Default to Ollama
        console.log(`Activating wordJanitor with ${selectedProvider}...`);
        
        // Visual feedback
        const originalText = activateBtn.innerText;
        activateBtn.innerText = 'Activated';
        activateBtn.classList.add('active-state');
        
        setTimeout(() => {
            activateBtn.innerText = originalText;
            activateBtn.classList.remove('active-state');
        }, 2000);

        // Backend communication logic will go here
    });
});
