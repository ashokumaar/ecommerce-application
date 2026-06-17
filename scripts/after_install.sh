#!/bin/bash
echo "Installing dependencies..."
# Navigate to your project directory and install dependencies
cd /var/www/html/my-react-app
npm install
npm run build
