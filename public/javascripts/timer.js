
document.addEventListener('DOMContentLoaded', function() {
    const input1 = document.getElementById('team1');
    const input2 = document.getElementById('team2');
    const toggleButton = document.getElementById('toggleButton');
    const timerInfo = document.getElementById('timerInfo');
    const liveCounter = document.getElementById('liveCounter');
    let timer;
    let startTime;
    let interval;

    function updateLiveCounter() {
        const now = new Date();
        const duration = ((now - startTime) / 1000).toFixed(1); // duration in seconds
        liveCounter.textContent = `Timer: ${duration} seconds`;
    }

    toggleButton.addEventListener('click', function() {
        if (toggleButton.textContent === 'Start match') {
            // Disable the input fields
            input1.disabled = true;
            input2.disabled = true;

            // Change button text to 'Stop Timer'
            toggleButton.textContent = 'Stop match';

            // Start the timer and record the start time
            startTime = new Date();

            // Start the live counter
            interval = setInterval(updateLiveCounter, 100);

            timer = setTimeout(function() {
                // Re-enable the input fields after the timer ends
                input1.disabled = false;
                input2.disabled = false;

                // Calculate and display the duration
                const endTime = new Date();
                const duration = (endTime - startTime) / 1000; // duration in seconds
                timerInfo.textContent = `Duration ${duration.toFixed(1)} seconds`;

                // Reset button text to 'Start Timer'
                toggleButton.textContent = 'Start match';

                // Stop the live counter
                clearInterval(interval);
                liveCounter.textContent = '';
            }, 5000000); // 5 seconds
        } else {
            // Stop the timer
            clearTimeout(timer);

            // Re-enable the input fields
            input1.disabled = false;
            input2.disabled = false;

            // Calculate and display the duration
            const endTime = new Date();
             const duration = ((endTime - startTime) / 1000)/60; // duration in seconds
            timerInfo.textContent = `Duration ${duration.toFixed(1)} Minutes`;

            // Reset button text to 'Start Timer'
            toggleButton.textContent = 'Start match';

            // Stop the live counter
            clearInterval(interval);
            liveCounter.textContent = '';
        }
    });
});
