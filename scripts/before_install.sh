#!/bin/bash
echo "Stopping the currently running server..."
# Assuming you're using PM2 to manage your Node.js application
pm2 stop my-react-app || true
