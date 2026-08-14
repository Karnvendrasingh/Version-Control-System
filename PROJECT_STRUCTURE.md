# MiniGit Project Structure

## 📁 Complete Project Organization

```
MiniGit-Version-Control-System/
├── 📁 Source Code
│   ├── src/minigit.cpp          # Main C++ implementation
│   ├── Makefile                 # Build configuration
│   ├── build.bat                # Windows build script
│   └── README.md                # C++ project documentation
│
├── 📁 Test Files
│   ├── test_files/
│   │   ├── sample.txt           # Sample text file for testing
│   │   └── main.cpp             # Sample C++ file for testing
│   └── commits/                 # Commit snapshots (created at runtime)
│
├── 🌐 Portfolio Website
│   ├── website/
│   │   ├── index.html           # Main portfolio page
│   │   ├── demo.html            # Interactive demo page
│   │   ├── styles.css           # Complete styling
│   │   └── script.js            # Interactive functionality
│   └── assets/                  # Images, icons, etc. (if needed)
│
├── 📚 Documentation
│   ├── PROJECT_STRUCTURE.md     # This file
│   ├── INSTALLATION.md          # Installation guide
│   └── API_DOCUMENTATION.md     # API reference
│
└── 🚀 Deployment Files
    ├── .gitignore               # Git ignore rules
    ├── package.json             # For web deployment (if needed)
    └── netlify.toml            # Netlify configuration
```

## 🔧 C++ Project Details

### Core Files
- **`minigit.cpp`**: Complete MiniGit implementation (1000+ lines)
  - Singly Linked List for commit chain
  - Hash Maps for file tracking
  - Stacks for undo/redo functionality
  - File I/O operations
  - Colored terminal output
  - Cross-platform support

### Build System
- **`Makefile`**: Unix/Linux/macOS build configuration
- **`build.bat`**: Windows build script with error checking
- **Compilation**: C++17 standard with optimization flags

### Features Implemented
✅ **Core Features**
- `init` - Initialize repository
- `add <filename>` - Stage files
- `commit -m "message"` - Commit changes
- `log` - View commit history
- `checkout <id>` - Restore previous commits
- `status` - Show repository status

✅ **Bonus Features**
- `undo`/`redo` - Navigate commit history
- `diff` - Compare file changes
- Colored terminal output
- File snapshots in `commits/` directories
- Cross-platform compatibility

## 🌐 Website Details

### Main Portfolio (`index.html`)
- **Hero Section**: Project introduction with animated terminal
- **About Section**: Project description and statistics
- **Tech Stack**: Technologies and data structures used
- **Features**: Complete feature showcase
- **Interactive Demo**: Terminal simulation
- **Download Section**: Source code and documentation links
- **Contact Form**: Contact information and form

### Interactive Demo (`demo.html`)
- **Standalone terminal simulation**
- **Real-time command processing**
- **Sample commands and responses**
- **Educational tool for understanding MiniGit**

### Styling (`styles.css`)
- **Modern design** with CSS Grid and Flexbox
- **Dark/Light theme** toggle functionality
- **Responsive layout** for all devices
- **Smooth animations** and transitions
- **Terminal-style interface** with realistic appearance

### Functionality (`script.js`)
- **Theme switching** with localStorage persistence
- **Smooth scrolling** navigation
- **Interactive demo** with command processing
- **Form handling** and validation
- **Animation triggers** on scroll
- **Mobile navigation** support

## 🎯 Key Features

### Data Structures Demonstrated
1. **Singly Linked List**: Commit chain management
2. **Hash Maps**: File content tracking
3. **Stacks**: Undo/redo functionality
4. **Vectors**: File lists and collections

### Algorithms Implemented
1. **Hashing**: Content change detection
2. **File Comparison**: Diff functionality
3. **Memory Management**: Proper cleanup
4. **Error Handling**: Robust error checking

### Web Technologies
1. **HTML5**: Semantic markup
2. **CSS3**: Modern styling with Grid/Flexbox
3. **JavaScript ES6+**: Interactive functionality
4. **Font Awesome**: Icons and visual elements
5. **Google Fonts**: Typography

## 🚀 Deployment Options

### C++ Application
- **Local compilation** with Makefile
- **Windows executable** with build.bat
- **Cross-platform** compatibility
- **No external dependencies** required

### Website
- **GitHub Pages**: Free hosting
- **Netlify**: Easy deployment
- **Vercel**: Modern hosting platform
- **Any static hosting**: Self-hosted option

## 📊 Project Statistics

### Code Metrics
- **C++ Lines**: 1000+ lines
- **HTML Lines**: 500+ lines
- **CSS Lines**: 800+ lines
- **JavaScript Lines**: 400+ lines
- **Total Lines**: 2700+ lines

### Features Count
- **Core Commands**: 6 commands
- **Bonus Commands**: 4 commands
- **Data Structures**: 4 structures
- **Web Sections**: 8 sections
- **Interactive Elements**: 10+ elements

### Browser Support
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🎨 Design System

### Color Palette
- **Primary**: #2563eb (Blue)
- **Secondary**: #7c3aed (Purple)
- **Accent**: #06b6d4 (Cyan)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Yellow)
- **Error**: #ef4444 (Red)

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Code Font**: Courier New (Terminal)
- **Font Weights**: 300, 400, 500, 600, 700

### Spacing System
- **Base Unit**: 0.25rem (4px)
- **Small**: 0.5rem (8px)
- **Medium**: 1rem (16px)
- **Large**: 1.5rem (24px)
- **Extra Large**: 2rem (32px)

## 🔄 Development Workflow

### C++ Development
1. **Edit** `minigit.cpp`
2. **Compile** with `make` or `build.bat`
3. **Test** with sample files
4. **Debug** if needed
5. **Document** changes

### Website Development
1. **Edit** HTML/CSS/JS files
2. **Preview** in browser
3. **Test** responsive design
4. **Validate** HTML/CSS
5. **Deploy** to hosting platform

## 📝 Documentation Standards

### Code Comments
- **Function headers** with purpose and parameters
- **Complex logic** explanations
- **Data structure** descriptions
- **Algorithm** explanations

### README Files
- **Installation** instructions
- **Usage** examples
- **Feature** descriptions
- **Troubleshooting** guides

### API Documentation
- **Function signatures**
- **Parameter descriptions**
- **Return values**
- **Usage examples**

## 🎯 Learning Objectives

### C++ Concepts
- **Object-Oriented Programming**
- **Memory Management**
- **File I/O Operations**
- **Data Structures**
- **Algorithms**
- **Error Handling**

### Web Development
- **Modern HTML5**
- **CSS Grid & Flexbox**
- **JavaScript ES6+**
- **Responsive Design**
- **Interactive UI**
- **Performance Optimization**

### Version Control
- **Git-like functionality**
- **Commit management**
- **File tracking**
- **History navigation**
- **Change detection**

---

**This project demonstrates a complete full-stack application combining C++ systems programming with modern web development, creating an educational and visually appealing version control system.** 