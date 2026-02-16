#!/bin/bash

# Dockium Redeploy Script (Ubuntu)
# Run this script to update your production instance with the latest code.

set -e # Exit on error

# 1. Update Code
echo "Updating code from GitHub..."
git pull origin master

# 2. Build Backend
echo "Building backend..."
cd backend
cargo build --release
cd ..

# 3. Build Frontend
echo "Building frontend..."
cd frontend
npm install
npx vite build
cd ..

# 4. Update Production Files
echo "Deploying to /opt/dockium..."
sudo mkdir -p /opt/dockium/public

# Stop service to release file locks
sudo systemctl stop dockium || true

# Copy Backend Binary
sudo cp backend/target/release/dockium-backend /opt/dockium/
sudo chmod +x /opt/dockium/dockium-backend

# Copy Frontend Assets
sudo rm -rf /opt/dockium/public/*
sudo cp -r frontend/dist/* /opt/dockium/public/
sudo chmod -R 755 /opt/dockium/public

# Copy .env if not exists
if [ ! -f /opt/dockium/.env ]; then
    echo "Creating default .env..."
    sudo cp backend/.env.example /opt/dockium/.env || sudo touch /opt/dockium/.env
fi

# 5. Restart Service
echo "Restarting service..."
sudo systemctl daemon-reload
sudo systemctl start dockium
sudo systemctl status dockium --no-pager

echo "------------------------------------------------"
echo "✅ Redeploy Complete! Visit http://your-ip"
echo "------------------------------------------------"
