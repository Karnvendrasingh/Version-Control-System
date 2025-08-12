@echo off
echo ========================================
echo    Testing All MiniGit Features
echo ========================================
echo.

REM Create test files
echo Creating test files...
echo "Hello World - Version 1" > test1.txt
echo "int main() { return 0; }" > test2.cpp

echo.
echo ========================================
echo Feature 1: Initialize Repository
echo ========================================
echo Testing: init command
echo init > commands.txt
echo exit >> commands.txt
echo Running init test...
minigit-new.exe < commands.txt
echo.

echo ========================================
echo Feature 2: Stage Files
echo ========================================
echo Testing: add command
echo init > commands.txt
echo add test1.txt >> commands.txt
echo add test2.cpp >> commands.txt
echo status >> commands.txt
echo exit >> commands.txt
echo Running add test...
minigit-new.exe < commands.txt
echo.

echo ========================================
echo Feature 3: Commit Changes
echo ========================================
echo Testing: commit command
echo init > commands.txt
echo add test1.txt >> commands.txt
echo commit -m "Initial commit" >> commands.txt
echo log >> commands.txt
echo exit >> commands.txt
echo Running commit test...
minigit-new.exe < commands.txt
echo.

echo ========================================
echo Feature 4: View History
echo ========================================
echo Testing: log command
echo init > commands.txt
echo add test1.txt >> commands.txt
echo commit -m "First commit" >> commands.txt
echo add test2.cpp >> commands.txt
echo commit -m "Second commit" >> commands.txt
echo log >> commands.txt
echo exit >> commands.txt
echo Running log test...
minigit-new.exe < commands.txt
echo.

echo ========================================
echo Feature 5: Status Tracking
echo ========================================
echo Testing: status command
echo init > commands.txt
echo add test1.txt >> commands.txt
echo commit -m "Initial commit" >> commands.txt
echo status >> commands.txt
echo exit >> commands.txt
echo Running status test...
minigit-new.exe < commands.txt
echo.

echo ========================================
echo Feature 6: Checkout & Undo
echo ========================================
echo Testing: checkout and undo commands
echo init > commands.txt
echo add test1.txt >> commands.txt
echo commit -m "First commit" >> commands.txt
echo add test2.cpp >> commands.txt
echo commit -m "Second commit" >> commands.txt
echo checkout 1 >> commands.txt
echo undo >> commands.txt
echo exit >> commands.txt
echo Running checkout/undo test...
minigit-new.exe < commands.txt
echo.

echo ========================================
echo Feature 7: Diff Detection
echo ========================================
echo Testing: diff command
echo init > commands.txt
echo add test1.txt >> commands.txt
echo commit -m "Initial commit" >> commands.txt
echo diff >> commands.txt
echo exit >> commands.txt
echo Running diff test...
minigit-new.exe < commands.txt
echo.

echo ========================================
echo Feature 8: Colored Output
echo ========================================
echo Testing: colored output
echo init > commands.txt
echo add nonexistent.txt >> commands.txt
echo add test1.txt >> commands.txt
echo commit -m "Test commit" >> commands.txt
echo status >> commands.txt
echo exit >> commands.txt
echo Running colored output test...
minigit-new.exe < commands.txt
echo.

echo ========================================
echo All Features Tested!
echo ========================================
echo.
echo If you see colored output and proper responses,
echo all features are working correctly!
echo.
pause 