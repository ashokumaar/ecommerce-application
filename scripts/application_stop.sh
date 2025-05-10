#!/bin/bash
echo "Stopping the application server..."
# Stop the application server if needed (already handled in BeforeInstall)
pm2 stop my-react-app || true
