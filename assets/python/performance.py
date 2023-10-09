import json
import subprocess
import time

def get_output(command):
    return subprocess.getoutput(command)

def fetch_metrics():
    def get_output(command):
        return subprocess.getoutput(command)

    # CPU Usage
    cpu_usage = get_output('top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk \'{print 100 - $1"%"}\'')
    # Memory Usage
    memory_usage = get_output('free -m | awk \'NR==2{printf "%.2f%%", $3*100/$2 }\'')
    # Disk Space
    disk_space = get_output('df -h | awk \'$NF=="/"{printf "%s", $5}\'')
    # Temperature
    cmd_temperature = 'vcgencmd measure_temp | cut -c "6-9"'
    temperature = f"{get_output(cmd_temperature)}°C"

    # Uptime
    uptime = get_output('uptime -p')

    # Network Metrics
    network_usage = get_output('ifstat -n 1 1 | tail -1')
    active_connections = get_output('netstat -tna | grep ESTABLISHED | wc -l')
    
    # System Metrics
    running_processes = get_output('ps aux | wc -l')
    load_average = get_output('uptime | grep -o "load average: .*" | cut -d" " -f3-5')

    # Hardware Metrics
    cpu_frequency_raw = float(get_output('vcgencmd measure_clock arm').split('=')[1])
    cpu_frequency = f"{cpu_frequency_raw / 1e9} GHz"  # Convert to GHz

    gpu_memory_raw = get_output('vcgencmd get_mem gpu').split('=')[1]
    gpu_memory = f"{float(gpu_memory_raw.replace('M', ''))} MB"

    # Storage Metrics
    disk_rw_rates = get_output("iostat -d -y 1 1 | grep mmcblk0 | awk '{print \"Read: \"$3\" kB/s, Write: \"$4\" kB/s\"}'")
    metrics = {
        'CPU Usage': cpu_usage,
        'Memory Usage': memory_usage,
        'Disk Space Used': disk_space,
        'Temperature': temperature,
        'Uptime': uptime,
        'Network Usage (Incoming Outgoing Bytes/s)': network_usage,
        'Active Network Connections': active_connections,
        'Running Processes': running_processes,
        'Load Average (1min 5min 15min)': load_average,
        'CPU Frequency': cpu_frequency,
        'GPU Memory Usage': gpu_memory,
        'Disk R/W Rates': disk_rw_rates
    }
    return metrics

if __name__ == "__main__":
    while True:
        metrics_data = fetch_metrics()
        with open('../data/metrics.json', 'w') as f:
            json.dump(metrics_data, f)
        time.sleep(5)  # Collect data every 10 seconds
