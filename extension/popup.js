document.addEventListener('DOMContentLoaded', () => {
    const activateBtn = document.getElementById('activate-btn');
    const statusDot = document.getElementById('status-dot');

    console.log("wordJanitor popup loaded.");

    // Handle "Activate" click
    activateBtn.addEventListener('click', () => {
        console.log("Checking if server is ready via app.py...");
        
        // Show loading state
        activateBtn.innerText = 'Connecting...';
        activateBtn.disabled = true;

        fetch('http://localhost:4769/ready')
            .then(response => response.text())
            .then(text => {
                const cleanText = text.trim();
                console.log("Server responded with:", cleanText);
                
                // Show whatever the server returned on the button
                activateBtn.innerText = cleanText;

                if (cleanText === 'Yoo') {
                    activateBtn.classList.add('active-state');
                    statusDot.classList.remove('status-offline');
                    statusDot.classList.add('status-online');
                }

                setTimeout(() => {
                    activateBtn.innerText = 'Activate';
                    activateBtn.classList.remove('active-state');
                    activateBtn.disabled = false;
                }, 3000);
            })
            .catch(err => {
                console.error("Failed to reach server:", err);
                alert("Could not connect to the wordJanitor server. Please make sure app.py is running.");
                activateBtn.innerText = 'Activate';
                activateBtn.disabled = false;
            });
    });
});
