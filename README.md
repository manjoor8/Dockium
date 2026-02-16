# 🌌 Dockium

**Dockium** is a production-ready, high-performance Docker Management Web Application designed for Linux servers. Built with **Rust** for the backend and **React** for the frontend, it provides a secure, lightweight, and real-time interface to manage your container ecosystem.

---

## 🏗️ Architecture

```ascii
+---------------------------------------+
|             Web Browser               |
|  (React + Tailwind + xterm.js)        |
+-------------------+-------------------+
                    |
          HTTPS / WebSockets
                    |
+-------------------v-------------------+
|           Dockium Backend             |
|      (Rust / Axum / Tokio)            |
+------+-----------+-----------+--------+
       |           |           |
+------v------+ +--v---------+ +--v-----+
| SQLite DB   | | sysinfo    | | Docker  |
| (Auth/Logs) | | (System)   | | Engine  |
+-------------+ +------------+ | API     |
                               +----+----+
                                    |
                          /var/run/docker.sock
```

### Tech Stack Reasoning
- **Backend (Rust)**: Chosen for memory safety, high performance with async I/O, and small binary footprint (~20MB total). Single binary deployment simplifies life for DevOps.
- **Frontend (React + Vite)**: Modern reactive UI for real-time updates. Tailwind CSS for a premium, responsive look.
- **Real-time**: WebSockets are used for container logs, terminal execution, and system performance telemetry.
- **Database**: SQLite with SQLx. Low overhead, zero-configuration persistence.

---

## 🚀 Key Features

- ✅ **Automatic Docker Installation**: Detects and installs Docker on Ubuntu/Debian/RHEL/AlmaLinux/Rocky.
- ✅ **Full Container Lifecycle**: Start, stop, restart, remove, and create containers.
- ✅ **Real-time Monitoring**: Dashboard with CPU, RAM, Disk, and Network bandwidth.
- ✅ **Terminal & Logs**: Live log streaming and `exec` terminal via xterm.js.
- ✅ **Image Management**: List, pull, and tag images.
- ✅ **Secure Access**: JWT Authentication with Role-Based Access Control (Admin, Operator, Viewer).
- ✅ **First Run Setup**: Securely setup the first admin account on startup.

---

## 🛠️ Installation (Linux)

### 1. Manual Installation
Clone this repository and run the installation script:

```bash
git clone https://github.com/manjoor/Dockium.git
cd Dockium
sudo bash scripts/install.sh
```

The script will:
1. Detect your OS.
2. Install Docker if missing.
3. Setup `dockium` system user and permissions.
4. Install the service and enable it via `systemd`.

### 2. Docker Deployment
You can run Dockium as a container itself:

```bash
docker run -d \
  --name dockium \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v dockium-data:/data \
  -p 8080:8080 \
  dockium/dockium:latest
```

---

## 🔒 Security Best Practices

- **Docker Socket**: The application runs under a dedicated `dockium` user with minimal permissions.
- **Authentication**: JWT tokens with short expiration times.
- **RBAC**: 
  - `Admin`: Full control.
  - `Operator`: Manage containers/images but cannot manage users/settings.
  - `Viewer`: Read-only access to stats and logs.
- **Input Validation**: All container creation parameters are strictly validated to prevent command injection.

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
cargo test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📈 Performance & Scaling
Dockium is tested to handle **500+ containers** simultaneously. The Rust backend uses non-blocking I/O and event-driven architecture to ensure the UI remains responsive even under heavy load.

---

## 📜 License
MIT
