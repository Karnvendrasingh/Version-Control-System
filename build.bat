@echo off
echo ========================================
echo    MiniGit Build Script for Windows
echo ========================================
echo.

REM Check if g++ is available
g++ --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: g++ compiler not found!
    echo Please install MinGW-w64 or Visual Studio Community.
    echo.
    echo Download MinGW-w64 from: https://www.mingw-w64.org/
    echo Or install Visual Studio Community from: https://visualstudio.microsoft.com/
    pause
    exit /b 1
)

echo Compiling MiniGit...
g++ -std=c++17 -Wall -Wextra -O2 -o minigit.exe src/minigit.cpp

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo    Compilation successful!
    echo ========================================
    echo.
    echo MiniGit executable created: minigit.exe
    echo.
    echo To run MiniGit, type: minigit.exe
    echo.
    set /p choice="Would you like to run MiniGit now? (y/n): "
    if /i "%choice%"=="y" (
        echo.
        echo Starting MiniGit...
        echo.
        minigit.exe
    )
) else (
    echo.
    echo ========================================
    echo    Compilation failed!
    echo ========================================
    echo.
    echo Please check the error messages above.
    pause
) 