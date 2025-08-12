# MiniGit - Lightweight Version Control System

A simplified Git-like version control system implemented in C++ that demonstrates the use of data structures and algorithms (DSA) concepts.

## 🚀 Features

### Core Features
- **Singly Linked List**: Represents the chain of commits
- **Hash Maps**: Track file content changes using `std::unordered_map`
- **File I/O**: Read and write file content during staging and commit
- **C++ Hash Functions**: Use `std::hash` for content tracking
- **Staging Area**: Add files before committing
- **Commit History**: View all commits with messages and timestamps
- **Checkout**: Restore project to previous commits

### Bonus Features
- **Undo/Redo**: Navigate through commit history using stacks
- **Diff**: Compare file changes between commits
- **Colored Terminal Output**: User-friendly colored messages
- **File Snapshots**: Save each commit's version in separate directories
- **Cross-platform**: Works on Windows, Linux, and macOS

## 🛠️ Tech Stack

- **C++17**: Modern C++ with filesystem support
- **Data Structures**: 
  - Singly Linked List (commit chain)
  - Hash Maps (file tracking)
  - Stacks (undo/redo)
  - Vectors (file lists)
- **Algorithms**: Hashing, file comparison, content tracking
- **File I/O**: Reading and writing files
- **Cross-platform**: Windows, Linux, macOS support

## 📦 Installation

### Prerequisites
- C++17 compatible compiler (GCC 7+, Clang 5+, or MSVC 2017+)
- Make (optional, for using Makefile)

### Build Instructions

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd minigit
   ```

2. **Compile using Makefile (recommended)**
   ```bash
   make
   ```

3. **Or compile manually**
   ```bash
   g++ -std=c++17 -Wall -Wextra -O2 -o minigit minigit.cpp
   ```

4. **Run the program**
   ```bash
   ./minigit
   ```

### Windows Users
If you don't have a C++ compiler installed:
1. Install MinGW-w64 or Visual Studio Community
2. Use the provided Makefile or compile manually
3. Run `minigit.exe` in Command Prompt or PowerShell

## 🎯 Usage

### Getting Started

1. **Initialize MiniGit**
   ```bash
   minigit> init
   ```

2. **Create some test files**
   ```bash
   echo "Hello World" > test.txt
   echo "int main() { return 0; }" > main.cpp
   ```

3. **Add files to staging**
   ```bash
   minigit> add test.txt
   minigit> add main.cpp
   ```

4. **Commit your changes**
   ```bash
   minigit> commit -m "Initial commit with test files"
   ```

### Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `init` | Initialize MiniGit repository | `init` |
| `add <filename>` | Add file to staging area | `add main.cpp` |
| `commit -m "message"` | Commit staged files | `commit -m "Add new feature"` |
| `log` | Show commit history | `log` |
| `checkout <id>` | Checkout to specific commit | `checkout 2` |
| `status` | Show current status | `status` |
| `undo` | Undo last checkout | `undo` |
| `redo` | Redo last undo | `redo` |
| `diff` | Show file differences | `diff` |
| `help` | Show help message | `help` |
| `exit` | Exit MiniGit | `exit` |

### Example Workflow

```bash
# Initialize repository
minigit> init

# Create and add files
echo "Hello World" > hello.txt
minigit> add hello.txt
minigit> commit -m "Add hello world file"

# Modify file
echo "Hello World v2" > hello.txt
minigit> add hello.txt
minigit> commit -m "Update hello world"

# Check status
minigit> status

# View history
minigit> log

# Checkout to previous version
minigit> checkout 1

# Undo checkout
minigit> undo
```

## 🏗️ Project Structure

```
minigit/
├── minigit.cpp      # Main source code
├── Makefile         # Build configuration
├── README.md        # This file
├── commits/         # Commit snapshots (created at runtime)
│   ├── commit_1/
│   ├── commit_2/
│   └── ...
└── test_files/      # Example files for testing
```

## 🔧 Data Structures Used

### 1. Singly Linked List (Commit Chain)
```cpp
struct CommitNode {
    int commitId;
    string commitMessage;
    string timestamp;
    unordered_map<string, string> fileHashes;
    CommitNode* next;
};
```

### 2. Hash Maps (File Tracking)
```cpp
unordered_map<string, string> stagingArea;  // filename -> content hash
unordered_map<string, string> fileHashes;   // filename -> content hash
```

### 3. Stacks (Undo/Redo)
```cpp
stack<CommitNode*> undoStack;
stack<CommitNode*> redoStack;
```

## 🎨 Features in Detail

### File Tracking
- Uses C++ `std::hash` to generate content hashes
- Tracks file modifications by comparing hashes
- Supports any text file type

### Commit System
- Each commit has a unique ID, message, and timestamp
- Files are stored as snapshots in `commits/commit_<id>/` directories
- Commit history is maintained in a linked list

### Undo/Redo System
- Uses stacks to implement undo/redo functionality
- Allows navigation through commit history
- Automatically clears redo stack when new commits are made

### Cross-platform Support
- ANSI color codes for terminal output
- Platform-specific screen clearing
- Standard C++ filesystem operations

## 🧪 Testing

Create test files and try different scenarios:

```bash
# Test basic workflow
echo "Test content" > test1.txt
echo "Another test" > test2.txt

# Test file modifications
echo "Modified content" > test1.txt

# Test checkout and undo
minigit> checkout 1
minigit> undo
```

## 🐛 Troubleshooting

### Common Issues

1. **"File not found" error**
   - Ensure the file exists in the current directory
   - Check file permissions

2. **"MiniGit not initialized" error**
   - Run `init` command first

3. **Compilation errors**
   - Ensure you have a C++17 compatible compiler
   - On Windows, make sure MinGW or Visual Studio is properly installed

4. **Permission errors**
   - Check if you have write permissions in the current directory

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Improving documentation
- Submitting pull requests

## 📞 Contact

For questions or support, please open an issue on the project repository.

---

**Happy Version Controlling! 🚀** 