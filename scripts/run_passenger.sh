#!/bin/bash

# Get the host IP
HOST_IP=$(hostname -I | cut -d' ' -f1)

echo "🚀 Starting Passenger App via Docker..."
echo "📱 Scan the QR code with Expo Go on your phone"
echo "ℹ️  Backend URL assumed: http://$HOST_IP:8000/api/v1 (Update src/api/client.ts if needed)"

docker run -it --rm \
  --cpus="1.5" \
  --memory="2g" \
  -v $(cd "$(dirname "$0")/../frontend/mobile-passenger" && pwd):/app \
  -w /app \
  -p 8082:8081 \
  -e REACT_NATIVE_PACKAGER_HOSTNAME=$HOST_IP \
  node:20-alpine \
  /bin/sh -c "npm install && npx expo start --tunnel"
