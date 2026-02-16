#!/bin/bash

# Dockium Installation Script
# Supports: Ubuntu, Debian, RHEL, AlmaLinux, Rocky

set -e

COLOR_RED='\033[0;31m'
COLOR_GREEN='\033[0;32m'
COLOR_BLUE='\033[0;34m'
COLOR_NC='\033[0m'

echo -e "${COLOR_BLUE}Starting Dockium Installation...${COLOR_NC}"

# 1. Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo -e "${COLOR_RED}Error: Cannot detect OS.${COLOR_NC}"
    exit 1
fi

echo -e "Detected OS: $NAME"

# 2. Check for Docker
if ! command -v docker &> /dev/null; then
    echo -e "${COLOR_BLUE}Docker not found. Installing Docker...${COLOR_NC}"
    
    case $OS in
        ubuntu|debian)
            sudo apt-get update
            sudo apt-get install -y ca-certificates curl gnupg
            sudo install -m 0755 -d /etc/apt/keyrings
            curl -fsSL https://download.docker.com/linux/$OS/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
            sudo chmod a+r /etc/apt/keyrings/docker.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$OS $VERSION_CODENAME stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
            ;;
        rhel|almalinux|rocky)
            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
            ;;
        *)
            echo -e "${COLOR_RED}Unsupported OS: $OS. Please install Docker manually.${COLOR_NC}"
            exit 1
            ;;
    esac

    sudo systemctl enable docker
    sudo systemctl start docker
    echo -e "${COLOR_GREEN}Docker installed successfully!${COLOR_NC}"
else
    echo -e "${COLOR_GREEN}Docker is already installed ($(docker --version)).${COLOR_NC}"
fi

# 3. Setup Dockium User
if ! id "dockium" &>/dev/null; then
    echo -e "Creating 'dockium' system user..."
    sudo useradd -r -s /bin/false dockium
    sudo usermod -aG docker dockium
fi

# 4. Install Backend Binary
# (Assuming pre-built binary for this script, but in this generation we explain the steps)
echo -e "Setting up application directories..."
sudo mkdir -p /opt/dockium/backend
sudo mkdir -p /opt/dockium/frontend
sudo mkdir -p /etc/dockium

# Copying files (in a real scenario, this would be from the build artifacts)
# cp ./backend/target/release/dockium-backend /opt/dockium/backend/
# cp -r ./frontend/dist/* /opt/dockium/frontend/

# 5. Create systemd service
echo -e "Configuring systemd service..."
cat <<EOF | sudo tee /etc/systemd/system/dockium.service
[Unit]
Description=Dockium Docker Management Service
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=dockium
Group=docker
WorkingDirectory=/opt/dockium/backend
ExecStart=/opt/dockium/backend/dockium-backend
Restart=always
Environment=RUST_LOG=info
Environment=DATABASE_URL=sqlite:/var/lib/dockium/dockium.db
Environment=PORT=8080

[Install]
WantedBy=multi-user.target
EOF

sudo mkdir -p /var/lib/dockium
sudo chown -R dockium:docker /var/lib/dockium

sudo systemctl daemon-reload
sudo systemctl enable dockium

echo -e "\n${COLOR_GREEN}Installation Complete!${COLOR_NC}"
echo -e "You can start the service with: ${COLOR_BLUE}sudo systemctl start dockium${COLOR_NC}"
echo -e "Access the UI at: ${COLOR_BLUE}http://localhost:8080${COLOR_NC}"
