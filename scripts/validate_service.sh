#!/bin/bash
echo "Validating the deployment..."
# Check if the server is running and responding
curl -s http://localhost:3000 || exit 1
