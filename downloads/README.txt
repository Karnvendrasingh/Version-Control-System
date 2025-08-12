MiniGit Version Control System - Downloads

This folder contains downloadable files for the MiniGit project.

FILES INCLUDED:
1. minigit.exe - Windows executable (ready to run)
2. MiniGit-Source.zip - Complete source code and project files

INSTALLATION INSTRUCTIONS:

For Windows Users (minigit.exe):
1. Download minigit.exe
2. Place it in any folder where you want to use MiniGit
3. Open Command Prompt in that folder
4. Run: minigit.exe
5. Type 'help' to see available commands

For Source Code (MiniGit-Source.zip):
1. Download and extract MiniGit-Source.zip
2. Open Command Prompt in the extracted folder
3. Run: build.bat (Windows) or make (Linux/macOS)
4. Run the compiled executable

SAMPLE USAGE:
minigit> init
minigit> add test_files/sample.txt
minigit> commit -m "Initial commit"
minigit> log
minigit> status
minigit> help

FEATURES:
- Initialize repository
- Add files to staging
- Commit changes with messages
- View commit history
- Checkout previous commits
- Undo/redo functionality
- File difference detection
- Colored terminal output

REQUIREMENTS:
- Windows: No additional requirements (minigit.exe)
- Source: C++17 compatible compiler (GCC 7+, Clang 5+, or MSVC 2017+)

For more information, visit the project website or read README.md in the source code.

Happy Version Controlling! 🚀 