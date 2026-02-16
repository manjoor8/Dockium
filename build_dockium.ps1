# Build script for Dockium
# This script uses system-wide cargo and node, but ensures VS environment is loaded for the backend.

$VS_DEV_CMD = "C:\Program Files\Microsoft Visual Studio\18\Community\Common7\Tools\VsDevCmd.bat"

echo "--- Building Backend ---"
# We run cargo build inside a CMD context that has VsDevCmd.bat called to avoid linker errors
if (Test-Path "$VS_DEV_CMD") {
    cmd /c "call `"$VS_DEV_CMD`" -arch=x64 && cd backend && cargo build --release"
} else {
    echo "Warning: VsDevCmd.bat not found at $VS_DEV_CMD. Attempting direct build..."
    cd backend
    cargo build --release
}

if ($LASTEXITCODE -ne 0) {
    echo "Backend build failed!"
    exit $LASTEXITCODE
}

echo "--- Building Frontend ---"
cd frontend
npm install
if ($LASTEXITCODE -ne 0) {
    echo "Frontend npm install failed!"
    exit $LASTEXITCODE
}
npm run build
if ($LASTEXITCODE -ne 0) {
    echo "Frontend build failed!"
    exit $LASTEXITCODE
}
cd ..

echo "--- Build Complete! ---"
