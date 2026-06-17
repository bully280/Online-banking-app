@echo off
REM Online Banking App - Quick Start Script for Windows
REM This script sets up and runs the banking application

echo.
echo 🏦 SecureBank - Online Banking Application
echo =========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js version: %NODE_VERSION%

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✓ npm version: %NPM_VERSION%
echo.

REM Backend setup
echo 📦 Setting up Backend...
if not exist "node_modules" (
    call npm install
) else (
    echo ✓ Backend dependencies already installed
)

REM Create .env file if it doesn't exist
if not exist "server\.env" (
    echo 📝 Creating server\.env file
    copy server\.env.example server\.env
    echo ✓ Created server\.env (Update with your settings if needed)
) else (
    echo ✓ server\.env already exists
)

echo.

REM Frontend setup
echo 📦 Setting up Frontend...
cd client
if not exist "node_modules" (
    call npm install
) else (
    echo ✓ Frontend dependencies already installed
)
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🚀 To start the application, run these commands in separate terminals:
echo.
echo Terminal 1 (Backend):
echo   npm start
echo.
echo Terminal 2 (Frontend):
echo   npm run client
echo.
echo Then open: http://localhost:3000
echo.
echo 📝 Default Credentials:
echo   Admin:  admin@banking.com / admin123
echo   User:   user@banking.com / user123
echo.
echo 📖 For more information, see INSTALLATION.md
echo.
pause
