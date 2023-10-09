let countdown = 10; // Starts the countdown at 10 seconds

function updateCountdown() {
    document.getElementById('countdown').textContent = countdown;
}

function getMetrics() {
    // Reset the countdown to 10 seconds every time we fetch the metrics
    countdown = 10;
    updateCountdown();
    fetch('/assets/data/metrics.json')
    .then(response => response.json())
    .then(data => {
        document.getElementById('cpu-usage').textContent = data['CPU Usage'];
        document.getElementById('memory-usage').textContent = data['Memory Usage'];
        document.getElementById('disk-space').textContent = data['Disk Space Used'];
        document.getElementById('temperature').textContent = data['Temperature'];
        document.getElementById('uptime').textContent = data['Uptime'];
        document.getElementById('disk-rw').textContent = data['Disk R/W Rates'];
        document.getElementById('active-connections').textContent = data['Active Network Connections'];
        document.getElementById('cpu-frequency').textContent = data['CPU Frequency'];
        document.getElementById('gpu-memory').textContent = data['GPU Memory Usage'];
        document.getElementById('load-average').textContent = data['Load Average (1min 5min 15min)'];
        document.getElementById('network-usage').textContent = data['Network Usage (Incoming Outgoing Bytes/s)'];
        document.getElementById('running-processes').textContent = data['Running Processes'];
    })
        .catch(error => console.error('Error fetching metrics:', error));
}

function decrementCountdown() {
    countdown--;
    updateCountdown();

    // If the countdown reaches 0, reset it to 10 (it will be reset in the getMetrics function anyway)
    if (countdown <= 0) {
        countdown = 10;
    }
}

// Call the getMetrics function immediately on page load
getMetrics();

// Then set up the interval to call it every 10 seconds
setInterval(getMetrics, 10000);

// Decrement the countdown every second
setInterval(decrementCountdown, 1000);
