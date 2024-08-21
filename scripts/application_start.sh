#!/bin/bash
echo "Starting the application server..."
# Start your Node.js server or any other service you use
pm2 start /var/www/html/my-react-app/server.js --name my-react-app
