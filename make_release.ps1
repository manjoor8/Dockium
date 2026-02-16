# Release script for Dockium (Windows Host Deployment)
# This script gathers the backend binary and frontend assets into a single 'release' folder.

$RELEASE_DIR = "release"

# 1. Clean/Create release directory
if (Test-Path $RELEASE_DIR) { 
    Remove-Item -Recurse -Force $RELEASE_DIR 
}
New-Item -ItemType Directory -Path $RELEASE_DIR
New-Item -ItemType Directory -Path "$RELEASE_DIR/public"

echo "--- Copying Backend ---"
if (Test-Path "backend/target/release/dockium-backend.exe") {
    Copy-Item "backend/target/release/dockium-backend.exe" -Destination "$RELEASE_DIR/"
} else {
    echo "Error: Backend binary not found. Run ./build_dockium.ps1 first."
    exit 1
}

echo "--- Copying Frontend ---"
if (Test-Path "frontend/dist") {
    Copy-Item -Recurse "frontend/dist/*" -Destination "$RELEASE_DIR/public"
} else {
    echo "Error: Frontend dist not found. Run ./build_dockium.ps1 first."
    exit 1
}

echo "--- Generating Environment Config ---"
$ENV_CONTENT = @"
PORT=8080
HOST=0.0.0.0
DATABASE_URL=sqlite:dockium.db
RUST_LOG=info
JWT_SECRET=$( [guid]::NewGuid().ToString() )
"@
$ENV_CONTENT | Out-File -FilePath "$RELEASE_DIR/.env" -Encoding utf8

echo "--- Deployment Package Ready in ./$RELEASE_DIR ---"
echo "To run the app:"
echo "cd $RELEASE_DIR"
echo ".\dockium-backend.exe"
