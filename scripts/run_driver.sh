#!/bin/bash

# Get the host IP (Linux specific, might need adjustment for Mac/Windows)
HOST_IP=$(hostname -I | cut -d' ' -f1)

echo "🚀 Starting Driver App via Docker..."
echo "📱 Scan the QR code with Expo Go on your phone"
echo "ℹ️  Backend URL assumed: http://$HOST_IP:8000/api/v1 (Update src/api/client.ts if needed)"

docker run -it --rm \
  -v $(cd "$(dirname "$0")/../frontend/mobile-driver" && pwd):/app \
  -w /app \
  -p 8081:8081 \
  -e REACT_NATIVE_PACKAGER_HOSTNAME=$HOST_IP \
  node:20-alpine \
  /bin/sh -c "rm -rf node_modules && npm install && npx expo start --tunnel"
