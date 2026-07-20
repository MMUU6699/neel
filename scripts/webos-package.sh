#!/bin/bash

# Ensure we are in the project root
cd "$(dirname "$0")/.."

# Check if ares-package is available
if ! command -v ares-package &> /dev/null
then
    echo "ares-package could not be found."
    echo "Please install the webOS CLI by following the LG documentation:"
    echo "npm install -g @webosose/ares-cli"
    exit 1
fi

echo "Packaging the webOS app..."

# Package the app from the webos/ directory and output the .ipk file to the current directory
ares-package webos -o .

echo "Package created successfully!"
echo "To install on your TV (assuming 'tv' is your configured device name in ares-setup-device):"
echo "ares-install --device tv com.index.tv_3.0.0_all.ipk"
