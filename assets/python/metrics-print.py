import subprocess

def get_output(command):
    return subprocess.getoutput(command)

def get_metrics():
    cpu_usage = get_output('top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk \'{print 100 - $1"%"}\'')
    memory_usage = get_output('free -m | awk \'NR==2{printf "%.2f%%", $3*100/$2 }\'')
    disk_space = get_output('df -h | awk \'$NF=="/"{printf "%s", $5}\'')
    temperature = get_output('vcgencmd measure_temp | cut -c "6-9"')
    uptime = get_output('uptime -p')

    # Network Metrics
    ip_address = get_output('hostname -I')
    network_usage = get_output('ifstat -n 1 1 | tail -1')
    active_connections = get_output('netstat -tna | grep ESTABLISHED | wc -l')

    # System Metrics
    running_processes = get_output('ps aux | wc -l')
    load_average = get_output('uptime | grep -o "load average: .*" | cut -d" " -f3-5')

    # Hardware Metrics
    cpu_frequency = get_output('vcgencmd measure_clock arm')
    gpu_memory = get_output('vcgencmd get_mem gpu')

    # Storage Metrics
    disk_rw_rates = get_output('iostat -d -y 1 1')
    inode_usage = get_output('df -i | grep /dev/root')

    print("CPU Usage:", cpu_usage)
    print("Memory Usage:", memory_usage)
    print("Disk Space:", disk_space)
    print("Temperature:", temperature)
    print("Uptime:", uptime)
    # print("IP Address:", ip_address)
    print("Network Usage (Incoming, Outgoing):", network_usage)
    print("Active Connections:", active_connections)
    print("Running Processes:", running_processes)
    print("Load Average:", load_average)
    print("CPU Frequency:", cpu_frequency)
    print("GPU Memory:", gpu_memory)
    print("Disk R/W Rates:", disk_rw_rates)
    print("Inode Usage:", inode_usage)


get_metrics()
