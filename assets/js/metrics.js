let countdown = 10; // Starts the countdown at 10 seconds

function updateCountdown() {
    document.getElementById('countdown').textContent = countdown;
}

function getMetrics() {
    // Reset the countdown to 10 seconds every time we fetch the metrics
    countdown = 10;
    updateCountdown();

    fetch('http://localhost:5000/metrics')
        .then(response => response.json())
        .then(data => {
            document.getElementById('cpu-usage').textContent = data.cpu_usage;
            document.getElementById('memory-usage').textContent = data.memory_usage;
            document.getElementById('disk-space').textContent = data.disk_space;
            document.getElementById('temperature').textContent = data.temperature;
            document.getElementById('uptime').textContent = data.uptime;
            document.getElementById('disk-rw').textContent = data["Disk R/W Rates:"];
            document.getElementById('active-connections').textContent = data.active_connections;
            document.getElementById('cpu-frequency').textContent = data.cpu_frequency;
            document.getElementById('gpu-memory').textContent = data.gpu_memory;
            document.getElementById('load-average').textContent = data.load_average;
            document.getElementById('network-usage').textContent = data.network_usage;
            document.getElementById('running-processes').textContent = data.running_processes;
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
