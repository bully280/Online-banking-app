#!/bin/bash

# Online Banking App - Quick Start Script
# This script sets up and runs the banking application

echo "🏦 SecureBank - Online Banking Application"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✓ npm version: $(npm --version)"
echo ""

# Backend setup
echo "📦 Setting up Backend..."
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✓ Backend dependencies already installed"
fi

# Create .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "📝 Creating server/.env file"
    cp server/.env.example server/.env
    echo "✓ Created server/.env (Update with your settings if needed)"
else
    echo "✓ server/.env already exists"
fi

echo ""

# Frontend setup
echo "📦 Setting up Frontend..."
cd client
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✓ Frontend dependencies already installed"
fi

cd ..
echo ""

# Display startup instructions
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application, run these commands in separate terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  npm start"
echo ""
echo "Terminal 2 (Frontend):"
echo "  npm run client"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "📝 Default Credentials:"
echo "  Admin:  admin@banking.com / admin123"
echo "  User:   user@banking.com / user123"
echo ""
echo "📖 For more information, see INSTALLATION.md"
echo ""
