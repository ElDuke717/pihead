from flask import Flask, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)

CORS(app)

@app.route('/metrics')
def get_metrics():
    def get_output(command):
        return subprocess.getoutput(command)

    cpu_usage = get_output('top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk \'{print 100 - $1"%"}\'')
    memory_usage = get_output('free -m | awk \'NR==2{printf "%.2f%%", $3*100/$2 }\'')
    disk_space = get_output('df -h | awk \'$NF=="/"{printf "%s", $5}\'')
    temperature = get_output('vcgencmd measure_temp | cut -c "6-9"')
    uptime = get_output('uptime -p')
    # Network Metrics
    #ip_address = get_output('hostname -I')
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

   
    return jsonify({
        'cpu_usage': cpu_usage,
        'memory_usage': memory_usage,
        'disk_space': disk_space,
        'temperature': temperature,
        'uptime': uptime,
        'network_usage': network_usage,
        'active_connections': active_connections,
        'running_processes': running_processes,
        'load_average': load_average,
        'cpu_frequency': cpu_frequency,
        'gpu_memory': gpu_memory,
        "Disk R/W Rates:": disk_rw_rates
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
