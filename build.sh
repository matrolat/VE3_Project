#!/bin/bash

# Check if we are running in a writable environment
if [ ! -w /tmp ]; then
    echo "Error: Temporary directory is not writable."
    exit 1
fi

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies and build the React app
npm install --prefix task-manager-frontend
npm run build --prefix task-manager-frontend
