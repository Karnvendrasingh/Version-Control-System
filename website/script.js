// MiniGit Portfolio Website JavaScript

// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const demoInput = document.getElementById('demo-input');
const demoContent = document.getElementById('demo-content');
const demoCommandBtns = document.querySelectorAll('.demo-command-btn');

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize theme
function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

// Update theme icon
function updateThemeIcon() {
    if (currentTheme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Toggle theme
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

// Mobile Navigation
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// Smooth scrolling for navigation links
function smoothScroll(e) {
    const targetId = this.getAttribute('href');
    // Only preventDefault for anchor links
    if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        closeMobileMenu();
    }
}

// Demo Terminal Functionality
const demoCommands = {
    'init': {
        output: 'MiniGit initialized successfully!',
        type: 'success'
    },
    'help': {
        output: `Available commands:
init                    - Initialize MiniGit repository
add <filename>          - Add file to staging area
commit -m "message"     - Commit staged files
log                     - Show commit history
checkout <id>           - Checkout to specific commit
status                  - Show current status
undo                    - Undo last checkout
redo                    - Redo last undo
diff                    - Show file differences
help                    - Show this help message
exit                    - Exit MiniGit`,
        type: 'info'
    },
    'status': {
        output: `=== Status ===
No staged files.

Tracked files:
  main.cpp (untracked)
  test.txt (untracked)

Current commit: None`,
        type: 'info'
    },
    'log': {
        output: 'No commits found.',
        type: 'warning'
    },
    'add main.cpp': {
        output: "Added 'main.cpp' to staging area.",
        type: 'success'
    },
    'commit -m "Initial commit"': {
        output: 'Committed 1 files with ID: 1\nMessage: Initial commit',
        type: 'success'
    },
    'add test.txt': {
        output: "Added 'test.txt' to staging area.",
        type: 'success'
    },
    'commit -m "Add test file"': {
        output: 'Committed 1 files with ID: 2\nMessage: Add test file',
        type: 'success'
    }
};

// Add line to demo terminal
function addDemoLine(command, output = null, type = 'command') {
    const line = document.createElement('div');
    line.className = 'demo-line';
    
    if (type === 'command') {
        line.innerHTML = `
            <span class="demo-prompt">minigit></span>
            <span class="demo-text">${command}</span>
        `;
    } else {
        line.className = 'demo-line output';
        const outputClass = type === 'success' ? 'success' : 
                           type === 'error' ? 'error' : 
                           type === 'warning' ? 'warning' : 'info';
        line.innerHTML = `<span class="${outputClass}">${output}</span>`;
    }
    
    demoContent.appendChild(line);
    demoContent.scrollTop = demoContent.scrollHeight;
}

// Process demo command
function processDemoCommand(command) {
    command = command.trim();
    
    if (!command) return;
    
    // Add command line
    addDemoLine(command);
    
    // Process command
    if (demoCommands[command]) {
        const response = demoCommands[command];
        setTimeout(() => {
            addDemoLine(command, response.output, response.type);
        }, 300);
    } else if (command.startsWith('add ')) {
        const filename = command.substring(4);
        setTimeout(() => {
            addDemoLine(command, `Added '${filename}' to staging area.`, 'success');
        }, 300);
    } else if (command.startsWith('commit -m ')) {
        const message = command.substring(10, command.length - 1);
        setTimeout(() => {
            addDemoLine(command, `Committed files with message: ${message}`, 'success');
        }, 300);
    } else if (command === 'exit') {
        setTimeout(() => {
            addDemoLine(command, 'Goodbye!', 'info');
        }, 300);
    } else {
        setTimeout(() => {
            addDemoLine(command, `Unknown command: ${command}`, 'error');
        }, 300);
    }
}

// Handle demo input
function handleDemoInput(e) {
    if (e.key === 'Enter') {
        const command = demoInput.value;
        processDemoCommand(command);
        demoInput.value = '';
    }
}

// Handle demo command buttons
function handleDemoCommandBtn() {
    const command = this.getAttribute('data-command');
    demoInput.value = command;
    processDemoCommand(command);
    demoInput.value = '';
}

// Download functions
function downloadSource() {
    // The download is now handled by the HTML download attribute
    // This function can be used for analytics or additional functionality
    console.log('Source code download initiated');
}

function downloadExe() {
    // The download is now handled by the HTML download attribute
    // This function can be used for analytics or additional functionality
    console.log('Windows executable download initiated');
}

function openGitHub() {
    window.open('https://github.com/Karnvendrasingh', '_blank');
}

function openLinkedIn() {
    window.open('https://www.linkedin.com/in/karnvendrasingh', '_blank');
}

function openDocs() {
    window.open('https://github.com/Karnvendrasingh/Version-Control-System#readme', '_blank');
}

// Contact form handling
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Here you would typically send the form data to a server
    // For now, we'll just show a success message
    alert(`Thank you for your message, ${name}!\n\nWe'll get back to you at ${email} soon.`);
    
    // Reset form
    e.target.reset();
}

// Intersection Observer for animations
function createIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.tech-card, .feature-card, .stat-card, .download-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        if (currentTheme === 'dark') {
            navbar.style.background = 'rgba(17, 24, 39, 0.98)';
        }
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        if (currentTheme === 'dark') {
            navbar.style.background = 'rgba(17, 24, 39, 0.95)';
        }
    }
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Typing animation for terminal
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize demo terminal with typing effect
function initDemoTerminal() {
    const welcomeText = "Welcome to MiniGit Demo!";
    const helpText = "Type 'help' to see available commands";
    
    setTimeout(() => {
        const firstLine = demoContent.querySelector('.demo-line:first-child .demo-text');
        typeWriter(firstLine, welcomeText);
    }, 1000);
    
    setTimeout(() => {
        const secondLine = demoContent.querySelector('.demo-line:nth-child(2) .demo-text');
        typeWriter(secondLine, helpText);
    }, 3000);
}

// === Enhanced Interactive Tutorial Logic ===
const tutorialSteps = [
    {
        title: "Welcome to the Version Control Tutorial!",
        content: "In this tutorial, you'll learn the basics of version control: init, add, commit, branch, and more. Click 'Next' to begin.",
        command: null,
        hint: "Click 'Next' to start the tutorial.",
        explanation: "Tutorial steps will guide you through each command.",
        quiz: null
    },
    {
        title: "Step 1: Initialize Repository",
        content: "Type the command to initialize a new repository.",
        command: "init",
        hint: "The command is just one word: 'init'",
        explanation: "'init' sets up a new version control repository.",
        quiz: null
    },
    {
        title: "Step 2: Add Files",
        content: "Type the command to add 'main.cpp' to the staging area.",
        command: "add main.cpp",
        hint: "Use 'add' followed by the filename.",
        explanation: "'add main.cpp' stages the file for commit.",
        quiz: null
    },
    {
        title: "Step 3: Commit Changes",
        content: "Type the command to commit with the message 'Initial commit'.",
        command: "commit -m \"Initial commit\"",
        hint: "Use commit -m followed by your message in quotes.",
        explanation: "'commit -m \"Initial commit\"' saves your staged changes.",
        quiz: null
    },
    {
        title: "Step 4: Branching",
        content: "Type the command to create a new branch called 'feature'.",
        command: "branch feature",
        hint: "Use 'branch' and the new branch name.",
        explanation: "'branch feature' creates a new branch for development.",
        quiz: null
    },
    {
        title: "Step 5: View History",
        content: "Type the command to view the commit history.",
        command: "log",
        hint: "It's a three-letter command.",
        explanation: "'log' shows all previous commits.",
        quiz: null
    },
    {
        title: "Quick Check!",
        content: "Which command stages a file for commit?",
        command: null,
        hint: "It's a three-letter command.",
        explanation: "'add' is used to stage files.",
        quiz: {
            question: "Which command stages a file for commit?",
            options: ["add", "commit", "log", "branch"],
            answer: 0
        }
    },
    {
        title: "Tutorial Complete!",
        content: "You have completed the basics. Try the quiz below to test your knowledge!",
        command: null,
        hint: "You can restart or review the tutorial.",
        explanation: "Great job! You can now use version control commands.",
        quiz: null
    }
];
let tutorialIndex = 0;
let tutorialAnswers = [];
function updateTutorialProgress() {
    const bar = document.getElementById('tutorial-progress-bar');
    if (!bar) return;
    const percent = ((tutorialIndex) / (tutorialSteps.length - 1)) * 100;
    bar.style.width = percent + '%';
}
function renderTutorialStep() {
    const contentDiv = document.getElementById('tutorial-content');
    const commandInput = document.getElementById('tutorial-command-input');
    const submitBtn = document.getElementById('tutorial-submit-command');
    const feedbackDiv = document.getElementById('tutorial-feedback');
    const hintBtn = document.getElementById('tutorial-hint-btn');
    const hintText = document.getElementById('tutorial-hint-text');
    const reviewDiv = document.getElementById('tutorial-review-content');
    if (!contentDiv) return;
    const step = tutorialSteps[tutorialIndex];
    // Step content
    contentDiv.innerHTML = `<h3>${step.title}</h3><p>${step.content}</p>`;
    // Command input visibility
    if (step.command) {
        document.getElementById('tutorial-command-container').style.display = '';
        commandInput.value = '';
        commandInput.disabled = false;
        submitBtn.disabled = false;
        commandInput.setAttribute('aria-label', 'Type your command for this step');
        commandInput.focus();
    } else {
        document.getElementById('tutorial-command-container').style.display = 'none';
    }
    // Quiz
    if (step.quiz) {
        let quizHtml = `<h4>${step.quiz.question}</h4>` +
            step.quiz.options.map((opt, i) => `<button class="btn btn-outline tutorial-quiz-option" data-index="${i}">${opt}</button>`).join('<br>');
        contentDiv.innerHTML += quizHtml;
        Array.from(document.getElementsByClassName('tutorial-quiz-option')).forEach(btn => {
            btn.addEventListener('click', function() {
                const selected = parseInt(this.getAttribute('data-index'));
                if (selected === step.quiz.answer) {
                    feedbackDiv.textContent = 'Correct!';
                    feedbackDiv.className = 'success';
                    tutorialAnswers[tutorialIndex] = {quiz: true, answer: selected, correct: true};
                } else {
                    feedbackDiv.textContent = 'Incorrect. Try again or see a hint.';
                    feedbackDiv.className = 'error';
                    tutorialAnswers[tutorialIndex] = {quiz: true, answer: selected, correct: false};
                }
            });
        });
        document.getElementById('tutorial-command-container').style.display = 'none';
    }
    // Feedback
    feedbackDiv.textContent = '';
    feedbackDiv.className = '';
    // Hint
    hintText.style.display = 'none';
    hintBtn.disabled = false;
    // Review
    reviewDiv.style.display = 'none';
    // Controls
    document.getElementById('tutorial-prev').disabled = tutorialIndex === 0;
    document.getElementById('tutorial-next').disabled = tutorialIndex === tutorialSteps.length - 1;
    updateTutorialProgress();
}
function handleTutorialCommandSubmit() {
    const step = tutorialSteps[tutorialIndex];
    const commandInput = document.getElementById('tutorial-command-input');
    const feedbackDiv = document.getElementById('tutorial-feedback');
    if (!step.command) return;
    const userCmd = commandInput.value.trim();
    if (userCmd.toLowerCase() === step.command.toLowerCase()) {
        feedbackDiv.textContent = 'Correct! ' + (step.explanation || '');
        feedbackDiv.className = 'success';
        commandInput.disabled = true;
        document.getElementById('tutorial-submit-command').disabled = true;
        tutorialAnswers[tutorialIndex] = {command: userCmd, correct: true};
    } else {
        feedbackDiv.textContent = 'Incorrect. Try again or see a hint.';
        feedbackDiv.className = 'error';
        tutorialAnswers[tutorialIndex] = {command: userCmd, correct: false};
    }
}
function handleTutorialHint() {
    const step = tutorialSteps[tutorialIndex];
    const hintText = document.getElementById('tutorial-hint-text');
    if (!step.hint) return;
    hintText.textContent = step.hint;
    hintText.style.display = '';
    document.getElementById('tutorial-hint-btn').disabled = true;
}
function handleTutorialRestart() {
    tutorialIndex = 0;
    tutorialAnswers = [];
    renderTutorialStep();
}
function handleTutorialReview() {
    const reviewDiv = document.getElementById('tutorial-review-content');
    reviewDiv.innerHTML = '<h4>Tutorial Review</h4>' + tutorialSteps.map((step, i) => {
        let answer = tutorialAnswers[i];
        let result = '';
        if (answer) {
            if (answer.command !== undefined) {
                result = answer.correct ? '<span style="color:var(--success-color)">Correct</span>' : '<span style="color:var(--error-color)">Incorrect</span>';
                return `<div><b>Step ${i+1}:</b> ${step.title}<br>Command: <code>${answer.command || ''}</code> - ${result}</div>`;
            } else if (answer.quiz !== undefined) {
                result = answer.correct ? '<span style="color:var(--success-color)">Correct</span>' : '<span style="color:var(--error-color)">Incorrect</span>';
                return `<div><b>Step ${i+1}:</b> ${step.title}<br>Quiz Answer: ${step.quiz.options[answer.answer] || ''} - ${result}</div>`;
            }
        }
        return `<div><b>Step ${i+1}:</b> ${step.title}<br><i>No answer</i></div>`;
    }).join('<hr>');
    reviewDiv.style.display = '';
}
document.addEventListener('DOMContentLoaded', function() {
    // Controls
    const prevBtn = document.getElementById('tutorial-prev');
    const nextBtn = document.getElementById('tutorial-next');
    const restartBtn = document.getElementById('tutorial-restart');
    const reviewBtn = document.getElementById('tutorial-review');
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            if (tutorialIndex > 0) tutorialIndex--;
            renderTutorialStep();
        });
        nextBtn.addEventListener('click', function() {
            if (tutorialIndex < tutorialSteps.length - 1) tutorialIndex++;
            renderTutorialStep();
        });
    }
    if (restartBtn) restartBtn.addEventListener('click', handleTutorialRestart);
    if (reviewBtn) reviewBtn.addEventListener('click', handleTutorialReview);
    // Command input
    const submitBtn = document.getElementById('tutorial-submit-command');
    const commandInput = document.getElementById('tutorial-command-input');
    if (submitBtn && commandInput) {
        submitBtn.addEventListener('click', handleTutorialCommandSubmit);
        commandInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleTutorialCommandSubmit();
        });
    }
    // Hint
    const hintBtn = document.getElementById('tutorial-hint-btn');
    if (hintBtn) hintBtn.addEventListener('click', handleTutorialHint);
    // Accessibility: focus on input for each step
    renderTutorialStep();
});

// === Enhanced Commit History Visualization ===
let commitGraph = [
    { id: 1, msg: 'Initial commit', branch: 'main', parent: null, x: 60, y: 60, current: true }
];
let branches = { main: 1 };
let currentBranch = 'main';
let nextCommitId = 2;
function renderCommitGraph() {
    const graphDiv = document.getElementById('commit-graph-container');
    if (!graphDiv) return;
    // Layout: horizontal for main, vertical for branches
    let svg = `<svg width="100%" height="160" viewBox="0 0 600 160">`;
    let branchY = { main: 60 };
    let branchColor = { main: '#2563eb' };
    let colorList = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#7c3aed'];
    let colorIdx = 1;
    // Draw lines
    for (const c of commitGraph) {
        if (c.parent) {
            const parent = commitGraph.find(x => x.id === c.parent);
            if (parent) {
                svg += `<line x1="${parent.x}" y1="${parent.y}" x2="${c.x}" y2="${c.y}" stroke="#888" stroke-width="3" />`;
            }
        }
    }
    // Draw nodes
    for (const c of commitGraph) {
        let color = branchColor[c.branch] || '#2563eb';
        svg += `<circle cx="${c.x}" cy="${c.y}" r="20" fill="${color}" stroke="${c.current ? '#ffd700' : '#fff'}" stroke-width="${c.current ? 5 : 2}" data-tooltip="${c.msg}" />`;
        svg += `<text x="${c.x}" y="${c.y + 5}" text-anchor="middle" fill="#fff" font-size="16">${c.id}</text>`;
        svg += `<title>${c.msg} (${c.branch})</title>`;
        if (c.current) {
            svg += `<text x="${c.x}" y="${c.y - 30}" text-anchor="middle" fill="#ffd700" font-size="13">HEAD${c.branch ? ' (' + c.branch + ')' : ''}</text>`;
        }
    }
    // Draw branch labels
    for (const b in branches) {
        const c = commitGraph.find(x => x.id === branches[b]);
        if (c) {
            svg += `<text x="${c.x}" y="${c.y + 40}" text-anchor="middle" fill="${branchColor[b] || '#2563eb'}" font-size="13">${b}</text>`;
        }
    }
    svg += `</svg>`;
    graphDiv.innerHTML = svg + `<div style="margin-top:1rem;">Each circle is a commit. HEAD and current branch are highlighted. Branches are color-coded.</div>`;
}
function addCommit(msg) {
    // Find current HEAD
    const head = commitGraph.find(c => c.current);
    let x = head ? head.x + 100 : 60;
    let y = head ? head.y : 60;
    commitGraph.forEach(c => c.current = false);
    commitGraph.push({ id: nextCommitId, msg, branch: currentBranch, parent: head ? head.id : null, x, y, current: true });
    branches[currentBranch] = nextCommitId;
    nextCommitId++;
    renderCommitGraph();
}
function createBranch(name) {
    // Branch from current HEAD
    const head = commitGraph.find(c => c.current);
    if (!head) return;
    let y = 60 + Object.keys(branches).length * 40;
    let x = head.x;
    let colorList = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#7c3aed'];
    let colorIdx = Object.keys(branches).length % colorList.length;
    branches[name] = head.id;
    currentBranch = name;
    branchColor[name] = colorList[colorIdx];
    branchY[name] = y;
    // Move HEAD to this branch
    commitGraph.forEach(c => c.current = false);
    head.current = true;
    renderCommitGraph();
}
function switchBranch(name) {
    if (!branches[name]) return;
    currentBranch = name;
    commitGraph.forEach(c => c.current = false);
    const head = commitGraph.find(c => c.id === branches[name]);
    if (head) head.current = true;
    renderCommitGraph();
}
// Hook into tutorial and demo terminal
const oldAnimateFileCommand = animateFileCommand;
animateFileCommand = function(cmd) {
    // Call old logic
    oldAnimateFileCommand(cmd);
    // Commit
    if (/^commit/.test(cmd)) {
        addCommit('Commit #' + (nextCommitId - 1));
    } else if (/^branch\s+(.+)$/i.test(cmd)) {
        const name = cmd.match(/^branch\s+(.+)$/i)[1].trim();
        createBranch(name);
    } else if (/^checkout-branch\s+(.+)$/i.test(cmd)) {
        const name = cmd.match(/^checkout-branch\s+(.+)$/i)[1].trim();
        switchBranch(name);
    }
};
document.addEventListener('DOMContentLoaded', renderCommitGraph);

// === Diff Viewer ===
function renderDiffViewer() {
    const diffDiv = document.getElementById('diff-viewer-container');
    if (!diffDiv) return;
    // Placeholder diff (replace with real diff logic or library)
    diffDiv.innerHTML = `
        <div style="display:flex;gap:2rem;">
            <div><h4>Old Version</h4><pre>int main() {\n    return 0;\n}</pre></div>
            <div><h4>New Version</h4><pre>int main() {\n    printf(\"Hello!\\n\");\n    return 0;\n}</pre></div>
        </div>
        <div style="margin-top:1rem;">This is a sample file diff. Changes between commits will be shown here.</div>
    `;
}
document.addEventListener('DOMContentLoaded', renderDiffViewer);

// === Quiz/Challenge Section ===
const quizQuestions = [
    {
        question: "What command initializes a new MiniGit repository?",
        options: ["add", "init", "commit", "log"],
        answer: 1
    },
    {
        question: "Which command stages a file for commit?",
        options: ["add", "commit", "branch", "merge"],
        answer: 0
    },
    {
        question: "How do you save a snapshot with a message?",
        options: ["commit -m 'message'", "add -m 'message'", "log", "status"],
        answer: 0
    }
];
let quizIndex = 0;
let quizScore = 0;
function renderQuizQuestion() {
    const quizDiv = document.getElementById('quiz-content');
    if (!quizDiv) return;
    if (quizIndex >= quizQuestions.length) {
        quizDiv.innerHTML = `<h3>Quiz Complete!</h3><p>Your score: ${quizScore} / ${quizQuestions.length}</p>`;
        return;
    }
    const q = quizQuestions[quizIndex];
    quizDiv.innerHTML = `<h4>${q.question}</h4>` +
        q.options.map((opt, i) => `<button class="btn btn-outline quiz-option" data-index="${i}">${opt}</button>`).join('<br>');
    Array.from(document.getElementsByClassName('quiz-option')).forEach(btn => {
        btn.addEventListener('click', function() {
            const selected = parseInt(this.getAttribute('data-index'));
            if (selected === q.answer) {
                quizScore++;
                this.classList.add('btn-primary');
            } else {
                this.classList.add('btn-secondary');
            }
            setTimeout(() => {
                quizIndex++;
                renderQuizQuestion();
            }, 700);
        });
    });
}
document.addEventListener('DOMContentLoaded', function() {
    renderQuizQuestion();
});

// === Enhanced File Workflow Animation ===
const fileIcons = {
    working: '<span class="file-icon">✏️</span>',
    staging: '<span class="file-icon">✅</span>',
    repo: '<span class="file-icon">🔒</span>'
};
const fileTooltips = {
    working: 'File in your working directory. Not yet staged.',
    staging: 'File is staged and ready to be committed.',
    repo: 'File is committed to the repository.'
};
let allFiles = ['main.cpp', 'file2.txt', 'README.md'];
const initialFileStates = () => ({
    working: [...allFiles],
    staging: [],
    repo: []
});
let fileStates = initialFileStates();
function renderFileArea() {
    const area = document.getElementById('file-area-animation');
    if (!area) return;
    area.innerHTML = `
        <div class="file-box" data-area="working" data-tooltip="${fileTooltips.working}">
            <div class="file-box-title"><i class="fas fa-folder-open"></i> Working Directory</div>
            <div class="file-list">${fileStates.working.map(f => `<div class="file-item" data-tooltip="${fileTooltips.working}" data-status="new">${fileIcons.working} ${f}</div>`).join('')}</div>
        </div>
        <div class="file-arrow-indicator"><i class="fas fa-arrow-right"></i></div>
        <div class="file-box" data-area="staging" data-tooltip="${fileTooltips.staging}">
            <div class="file-box-title"><i class="fas fa-layer-group"></i> Staging Area</div>
            <div class="file-list">${fileStates.staging.map(f => `<div class="file-item" data-tooltip="${fileTooltips.staging}" data-status="modified">${fileIcons.staging} ${f}</div>`).join('')}</div>
        </div>
        <div class="file-arrow-indicator"><i class="fas fa-arrow-right"></i></div>
        <div class="file-box" data-area="repo" data-tooltip="${fileTooltips.repo}">
            <div class="file-box-title"><i class="fas fa-box-archive"></i> Repository</div>
            <div class="file-list">${fileStates.repo.map(f => `<div class="file-item" data-tooltip="${fileTooltips.repo}" data-status="committed">${fileIcons.repo} ${f}</div>`).join('')}</div>
        </div>
    `;
}
// === Animated File Movement and Modification ===
function animateFileMove(filename, fromArea, toArea) {
    // Find the file element in the fromArea and animate it out
    const fromBox = document.querySelector(`.file-box[data-area="${fromArea}"]`);
    if (fromBox) {
        const fileEl = Array.from(fromBox.querySelectorAll('.file-item')).find(el => el.textContent.trim().endsWith(filename));
        if (fileEl) {
            fileEl.style.opacity = '0';
            fileEl.style.transform = 'translateY(30px)';
        }
    }
    setTimeout(() => {
        renderFileArea();
        // Animate into new area
        const toBox = document.querySelector(`.file-box[data-area="${toArea}"]`);
        if (toBox) {
            const fileEl = Array.from(toBox.querySelectorAll('.file-item')).find(el => el.textContent.trim().endsWith(filename));
            if (fileEl) {
                fileEl.style.opacity = '0';
                fileEl.style.transform = 'translateY(-30px)';
                setTimeout(() => {
                    fileEl.style.transition = 'opacity 0.5s, transform 0.5s';
                    fileEl.style.opacity = '1';
                    fileEl.style.transform = 'translateY(0)';
                }, 50);
            }
        }
    }, 350);
}
function animateFileCommand(cmd) {
    // Recognize add <filename> for any file
    if (/^add\s+(.+)$/i.test(cmd)) {
        const filename = cmd.match(/^add\s+(.+)$/i)[1].trim();
        if (fileStates.working.includes(filename)) {
            animateFileMove(filename, 'working', 'staging');
            fileStates.working = fileStates.working.filter(f => f !== filename);
            fileStates.staging.push(filename);
        }
    } else if (/^commit/.test(cmd)) {
        // Commit all staged files
        fileStates.staging.forEach(filename => animateFileMove(filename, 'staging', 'repo'));
        fileStates.repo = fileStates.repo.concat(fileStates.staging);
        fileStates.staging = [];
    } else if (cmd === 'init') {
        fileStates = initialFileStates();
        renderFileArea();
    } else if (/^modify\s+(.+)$/i.test(cmd)) {
        // Mark file as modified in working directory
        const filename = cmd.match(/^modify\s+(.+)$/i)[1].trim();
        if (fileStates.working.includes(filename)) {
            // Add a 'modified' status for this file
            setTimeout(() => {
                const box = document.querySelector('.file-box[data-area="working"]');
                if (box) {
                    const fileEl = Array.from(box.querySelectorAll('.file-item')).find(el => el.textContent.trim().endsWith(filename));
                    if (fileEl) {
                        fileEl.setAttribute('data-status', 'modified');
                        fileEl.setAttribute('data-tooltip', 'File has been modified.');
                        fileEl.style.border = '2px dashed #f59e0b';
                    }
                }
            }, 100);
        }
    }
}
// Reset button
function resetFileArea() {
    fileStates = initialFileStates();
    renderFileArea();
}
document.addEventListener('DOMContentLoaded', function() {
    renderFileArea();
    const resetBtn = document.getElementById('file-area-reset');
    if (resetBtn) resetBtn.onclick = resetFileArea;
});
// Integrate with tutorial and demo terminal
const oldHandleTutorialCommandSubmit2 = handleTutorialCommandSubmit;
handleTutorialCommandSubmit = function() {
    const step = tutorialSteps[tutorialIndex];
    const commandInput = document.getElementById('tutorial-command-input');
    const userCmd = commandInput.value.trim();
    animateFileCommand(userCmd);
    oldHandleTutorialCommandSubmit2();
    saveProgress();
};
// Integrate with demo terminal (if present)
if (typeof processDemoCommand === 'function') {
    const oldProcessDemoCommand = processDemoCommand;
    window.processDemoCommand = function(command) {
        animateFileCommand(command);
        oldProcessDemoCommand(command);
    };
}

// === Achievements/Badges ===
const badges = [
    {id: 'tutorial', label: 'Tutorial Complete', icon: '🏅'},
    {id: 'quiz', label: 'Quiz Master', icon: '🎓'},
    {id: 'merge', label: 'Conflict Resolver', icon: '🛠️'}
];
function renderBadges() {
    const container = document.getElementById('badges-container');
    if (!container) return;
    const unlocked = loadProgress().badges || [];
    container.innerHTML = badges.map(b => `
        <div class="badge${unlocked.includes(b.id) ? '' : ' locked'}" title="${b.label}">${b.icon}</div>
        <div class="badge-label">${b.label}</div>
    `).join('');
}
function unlockBadge(id) {
    let progress = loadProgress();
    if (!progress.badges) progress.badges = [];
    if (!progress.badges.includes(id)) progress.badges.push(id);
    localStorage.setItem('minigit-progress', JSON.stringify(progress));
    renderBadges();
}
document.addEventListener('DOMContentLoaded', renderBadges);

// === Glossary ===
const glossaryTerms = [
    {term: 'Repository', def: 'A database storing all the files and history of your project.'},
    {term: 'Commit', def: 'A snapshot of your project at a point in time.'},
    {term: 'Staging Area', def: 'A place to prepare files before committing.'},
    {term: 'Branch', def: 'A parallel version of the repository.'},
    {term: 'Merge', def: 'Combining changes from different branches.'},
    {term: 'Conflict', def: 'A situation where two changes clash and must be resolved.'},
    {term: 'Log', def: 'A history of commits.'},
    {term: 'Init', def: 'Command to initialize a new repository.'},
    {term: 'Add', def: 'Command to stage files for commit.'}
];
function renderGlossary() {
    const container = document.getElementById('glossary-content');
    if (!container) return;
    container.innerHTML = glossaryTerms.map(t => `
        <div class="glossary-term">${t.term}</div>
        <div class="glossary-def">${t.def}</div>
    `).join('');
}
document.addEventListener('DOMContentLoaded', renderGlossary);

// === Cheat Sheet ===
const cheatSheetText = `init                    Initialize MiniGit repository\nadd <filename>          Add file to staging area\ncommit -m "message"     Commit staged files\nlog                     Show commit history\nbranch <name>           Create a new branch\nmerge <name>            Merge branch into current\nstatus                  Show current status\nundo                    Undo last checkout\nredo                    Redo last undo\ndiff                    Show file differences\nhelp                    Show help message\n`;
function renderCheatSheet() {
    const content = document.getElementById('cheat-sheet-content');
    if (!content) return;
    content.textContent = cheatSheetText;
    const downloadBtn = document.getElementById('download-cheat-sheet');
    if (downloadBtn) {
        downloadBtn.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(cheatSheetText);
    }
}
document.addEventListener('DOMContentLoaded', renderCheatSheet);

// === Merge Conflict Simulation ===
function showMergeConflictModal() {
    const modal = document.getElementById('merge-conflict-modal');
    const content = document.getElementById('merge-conflict-content');
    if (!modal || !content) return;
    modal.style.display = 'flex';
    content.innerHTML = `
        <p><b>Conflict:</b> Both branches changed the same line in <code>main.cpp</code>.</p>
        <pre>>>>>>>>> branch feature\nprintf("Hello from feature!\n");\n=======\nprintf("Hello from main!\n");\n<<<<<<<< main</pre>
        <p>Type the resolved line below and click 'Resolve':</p>
        <input type="text" id="conflict-resolve-input" placeholder="e.g. printf('Hello world!\n');" style="width:100%;margin-bottom:1rem;">
        <button id="resolve-conflict-btn" class="btn btn-primary">Resolve</button>
        <div id="conflict-feedback"></div>
    `;
    document.getElementById('resolve-conflict-btn').onclick = function() {
        const val = document.getElementById('conflict-resolve-input').value.trim();
        const feedback = document.getElementById('conflict-feedback');
        if (val.toLowerCase().includes('hello')) {
            feedback.textContent = 'Conflict resolved!';
            feedback.className = 'success';
            unlockBadge('merge');
            setTimeout(() => { modal.style.display = 'none'; }, 1200);
        } else {
            feedback.textContent = 'Try to resolve the conflict by including "Hello".';
            feedback.className = 'error';
        }
    };
    document.getElementById('close-merge-modal').onclick = function() {
        modal.style.display = 'none';
    };
}
// Add a button to launch merge conflict in the tutorial (for demo)
document.addEventListener('DOMContentLoaded', function() {
    const tutorialDiv = document.getElementById('tutorial-content');
    if (tutorialDiv) {
        const btn = document.createElement('button');
        btn.textContent = 'Simulate Merge Conflict';
        btn.className = 'btn btn-outline';
        btn.onclick = showMergeConflictModal;
        tutorialDiv.appendChild(btn);
    }
});

// === Progress Saving/Loading ===
function saveProgress() {
    const progress = {
        tutorialIndex,
        tutorialAnswers,
        badges: loadProgress().badges || []
    };
    localStorage.setItem('minigit-progress', JSON.stringify(progress));
}
function loadProgress() {
    try {
        return JSON.parse(localStorage.getItem('minigit-progress')) || {};
    } catch { return {}; }
}
document.addEventListener('DOMContentLoaded', function() {
    // Load progress
    const progress = loadProgress();
    if (progress.tutorialIndex !== undefined) tutorialIndex = progress.tutorialIndex;
    if (progress.tutorialAnswers !== undefined) tutorialAnswers = progress.tutorialAnswers;
    renderTutorialStep();
    renderBadges();
});
// Unlock badges on tutorial/quiz completion
const oldRenderQuizQuestion = renderQuizQuestion;
renderQuizQuestion = function() {
    oldRenderQuizQuestion();
    if (quizIndex >= quizQuestions.length) {
        unlockBadge('quiz');
        saveProgress();
    }
};
const oldRenderTutorialStep = renderTutorialStep;
renderTutorialStep = function() {
    oldRenderTutorialStep();
    if (tutorialIndex === tutorialSteps.length - 1) {
        unlockBadge('tutorial');
        saveProgress();
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Event listeners
    themeToggle.addEventListener('click', toggleTheme);
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Demo terminal
    demoInput.addEventListener('keypress', handleDemoInput);
    demoCommandBtns.forEach(btn => {
        btn.addEventListener('click', handleDemoCommandBtn);
    });
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Scroll events
    window.addEventListener('scroll', handleNavbarScroll);
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initialize animations
    createIntersectionObserver();
    
    // Initialize demo terminal
initDemoTerminal();

// Initialize all animations
document.addEventListener('DOMContentLoaded', function() {
    addScrollAnimations();
    addTypingAnimation();
    addParticleEffect();
    addButtonEffects();
    addCardFlipEffects();
    addParallaxEffect();
    addLoadingAnimation();
    animateCounters();
    addTypingEffect();
    addMouseTrail();
    addScrollProgress();
    addConfettiEffect();
});

// Add awesome scroll-triggered animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                entry.target.style.animationDelay = `${index * 0.1}s`;
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                
                // Add special effects for different elements
                if (entry.target.classList.contains('tech-card')) {
                    entry.target.style.animation = 'bounceIn 0.8s ease-out';
                } else if (entry.target.classList.contains('feature-card')) {
                    entry.target.style.animation = 'scaleIn 0.6s ease-out';
                } else if (entry.target.classList.contains('stat-card')) {
                    entry.target.style.animation = 'slideInFromBottom 0.8s ease-out';
                }
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.tech-card, .feature-card, .stat-card, .download-card, .contact-method');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.9)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Add typing animation to terminal
function addTypingAnimation() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    terminalLines.forEach((line, index) => {
        line.style.setProperty('--line-index', index);
        line.style.opacity = '0';
        line.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            line.style.transition = 'all 0.5s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        }, index * 300);
    });
}

// Add particle effect to hero section
function addParticleEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        hero.appendChild(particle);
    }
}

// Add hover effects to buttons
function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

// Add card flip effects
function addCardFlipEffects() {
    const cards = document.querySelectorAll('.tech-card, .feature-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'perspective(1000px) rotateY(5deg) translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(0deg) translateY(0)';
        });
    });
}

// Add smooth parallax effect
function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before, .section-header');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Add loading animation
function addLoadingAnimation() {
    const loadingElements = document.querySelectorAll('.download-btn');
    loadingElements.forEach(btn => {
        btn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="loading"></span> Downloading...';
            
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });
    });
}

// Add counter animation to stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const increment = target / 100;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = counter.textContent.replace(/\d+/, target);
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Add typing effect to terminal
function addTypingEffect() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    terminalLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        line.style.opacity = '0';
        
        setTimeout(() => {
            line.style.opacity = '1';
            let charIndex = 0;
            
            const typeChar = () => {
                if (charIndex < text.length) {
                    line.textContent += text[charIndex];
                    charIndex++;
                    setTimeout(typeChar, 50);
                }
            };
            
            typeChar();
        }, index * 1000);
    });
}

// Add mouse trail effect
function addMouseTrail() {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.7;
        transition: all 0.1s ease;
    `;
    document.body.appendChild(trail);
    
    document.addEventListener('mousemove', (e) => {
        trail.style.left = e.clientX - 5 + 'px';
        trail.style.top = e.clientY - 5 + 'px';
    });
}

// Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Add confetti effect for downloads
function addConfettiEffect() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            createConfetti();
        });
    });
}

function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#37b9e8'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * window.innerWidth}px;
            z-index: 10000;
            pointer-events: none;
            animation: confettiFall 3s linear forwards;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(${window.innerHeight + 100}px) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
    
    // Add some initial demo content
    setTimeout(() => {
        processDemoCommand('init');
    }, 5000);
    
    setTimeout(() => {
        processDemoCommand('add main.cpp');
    }, 7000);
    
    setTimeout(() => {
        processDemoCommand('commit -m "Initial commit"');
    }, 9000);
});

// Add some utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Export functions for global access
window.MiniGit = {
    showNotification,
    downloadSource,
    downloadExe,
    openGitHub,
    openLinkedIn,
    openDocs
}; 

document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const body = document.body;

  // Set initial mode from localStorage
  if (localStorage.getItem('minigit-theme') === 'dark') {
    body.classList.add('dark-mode');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      body.classList.toggle('dark-mode');
      const isDark = body.classList.contains('dark-mode');
      if (themeIcon) {
        if (isDark) {
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
        } else {
          themeIcon.classList.remove('fa-sun');
          themeIcon.classList.add('fa-moon');
        }
      }
      localStorage.setItem('minigit-theme', isDark ? 'dark' : 'light');
    });
  }

  // Hamburger menu functionality
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
    // Close menu when a link is clicked (for single page navigation)
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
      });
    });
  }
}); 

// === Animated Arrows and File Content Preview ===
function renderFileArrows() {
    const area = document.getElementById('file-area-animation');
    if (!area) return;
    // Remove old arrows
    const oldSvg = document.getElementById('file-arrows-svg');
    if (oldSvg) oldSvg.remove();
    // Get box positions
    const boxes = ['working', 'staging', 'repo'].map(areaName => {
        const el = area.querySelector(`.file-box[data-area="${areaName}"]`);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const parentRect = area.getBoundingClientRect();
        return {
            name: areaName,
            x: rect.left - parentRect.left + rect.width / 2,
            y: rect.top - parentRect.top + rect.height / 2
        };
    });
    // Draw SVG arrows
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('id', 'file-arrows-svg');
    svg.setAttribute('width', area.offsetWidth);
    svg.setAttribute('height', area.offsetHeight);
    svg.style.position = 'absolute';
    svg.style.left = '0';
    svg.style.top = '0';
    svg.style.pointerEvents = 'none';
    // Arrowhead marker
    const defs = document.createElementNS(svgNS, 'defs');
    defs.innerHTML = `<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="strokeWidth"><polygon points="0 0, 10 3.5, 0 7" fill="#06b6d4"/></marker>`;
    svg.appendChild(defs);
    // Arrows: working→staging, staging→repo
    if (boxes[0] && boxes[1]) {
        const arrow = document.createElementNS(svgNS, 'line');
        arrow.setAttribute('x1', boxes[0].x + 60);
        arrow.setAttribute('y1', boxes[0].y);
        arrow.setAttribute('x2', boxes[1].x - 60);
        arrow.setAttribute('y2', boxes[1].y);
        arrow.setAttribute('class', 'file-arrow');
        arrow.setAttribute('marker-end', 'url(#arrowhead)');
        svg.appendChild(arrow);
    }
    if (boxes[1] && boxes[2]) {
        const arrow = document.createElementNS(svgNS, 'line');
        arrow.setAttribute('x1', boxes[1].x + 60);
        arrow.setAttribute('y1', boxes[1].y);
        arrow.setAttribute('x2', boxes[2].x - 60);
        arrow.setAttribute('y2', boxes[2].y);
        arrow.setAttribute('class', 'file-arrow');
        arrow.setAttribute('marker-end', 'url(#arrowhead)');
        svg.appendChild(arrow);
    }
    area.appendChild(svg);
}
function showFileModal(filename, area) {
    const modal = document.getElementById('file-content-modal');
    const title = document.getElementById('file-modal-title');
    const content = document.getElementById('file-modal-content');
    const status = document.getElementById('file-modal-status');
    if (!modal) return;
    // Get file content from latest commit
    let head = commitGraph.find(c => c.current);
    let fileLines = (fileHistory[head?.id] && fileHistory[head.id][filename]) ? fileHistory[head.id][filename] : ['(empty)'];
    title.textContent = filename + ' (' + area.charAt(0).toUpperCase() + area.slice(1) + ')';
    content.textContent = fileLines.join('\n');
    let stat = '';
    if (area === 'working') stat = 'Not staged';
    else if (area === 'staging') stat = 'Staged for commit';
    else if (area === 'repo') stat = 'Committed';
    status.textContent = stat;
    modal.style.display = 'flex';
}
document.addEventListener('DOMContentLoaded', function() {
    // Modal close
    const modal = document.getElementById('file-content-modal');
    const closeBtn = document.getElementById('close-file-modal');
    if (closeBtn) closeBtn.onclick = () => { modal.style.display = 'none'; };
    window.onclick = function(event) {
        if (event.target === modal) modal.style.display = 'none';
    };
});
// Enhance renderFileArea to add click handlers and call renderFileArrows
const oldRenderFileArea = renderFileArea;
renderFileArea = function() {
    oldRenderFileArea();
    // Add click handlers
    ['working', 'staging', 'repo'].forEach(areaName => {
        const box = document.querySelector(`.file-box[data-area="${areaName}"]`);
        if (box) {
            Array.from(box.querySelectorAll('.file-item')).forEach(item => {
                item.onclick = () => {
                    const filename = item.textContent.replace(/^[^a-zA-Z0-9]*/, '').trim();
                    showFileModal(filename, areaName);
                };
            });
        }
    });
    // Draw arrows
    setTimeout(renderFileArrows, 100);
};
// Highlight files/areas on command
function highlightFile(filename, area) {
    const box = document.querySelector(`.file-box[data-area="${area}"]`);
    if (box) {
        box.classList.add('highlight');
        Array.from(box.querySelectorAll('.file-item')).forEach(item => {
            if (item.textContent.trim().endsWith(filename)) item.classList.add('highlight');
        });
        setTimeout(() => {
            box.classList.remove('highlight');
            Array.from(box.querySelectorAll('.file-item')).forEach(item => item.classList.remove('highlight'));
        }, 900);
    }
}
const oldAnimateFileCommand3 = animateFileCommand;
animateFileCommand = function(cmd) {
    // Highlight logic
    if (/^add\s+(.+)$/i.test(cmd)) {
        const filename = cmd.match(/^add\s+(.+)$/i)[1].trim();
        highlightFile(filename, 'staging');
    } else if (/^commit/.test(cmd)) {
        fileStates.repo.forEach(filename => highlightFile(filename, 'repo'));
    } else if (/^modify\s+(.+)$/i.test(cmd)) {
        const filename = cmd.match(/^modify\s+(.+)$/i)[1].trim();
        highlightFile(filename, 'working');
    }
    oldAnimateFileCommand3(cmd);
}; 

// === Commit Graph Explanations and Highlights ===
function explainCommit(commit) {
    const expDiv = document.getElementById('commit-explanation');
    if (!expDiv) return;
    if (!commit) { expDiv.textContent = ''; return; }
    let msg = `<b>Commit ${commit.id}</b> on <b>${commit.branch}</b> branch.`;
    if (commit.current) msg += ' <span style="color:#ffd700;">(HEAD - your current position)</span>';
    msg += `<br>Message: <i>${commit.msg}</i>`;
    if (commit.parent) {
        const parent = commitGraph.find(c => c.id === commit.parent);
        if (parent) msg += `<br>Parent: Commit ${parent.id} (${parent.branch})`;
    }
    // Find children
    const children = commitGraph.filter(c => c.parent === commit.id);
    if (children.length) {
        msg += `<br>Child${children.length > 1 ? 'ren' : ''}: ` + children.map(c => `Commit ${c.id} (${c.branch})`).join(', ');
    }
    expDiv.innerHTML = msg;
}
function highlightCommitAndRelatives(commit) {
    // Remove old highlights
    document.querySelectorAll('.commit-node').forEach(el => el.classList.remove('highlight'));
    if (!commit) return;
    // Highlight this, parent, and children
    const ids = [commit.id];
    if (commit.parent) ids.push(commit.parent);
    commitGraph.filter(c => c.parent === commit.id).forEach(c => ids.push(c.id));
    ids.forEach(id => {
        const el = document.getElementById('commit-node-' + id);
        if (el) el.classList.add('highlight');
    });
}
// Enhance renderCommitGraph for larger nodes, labels, and event handlers
const oldRenderCommitGraph2 = renderCommitGraph;
renderCommitGraph = function() {
    oldRenderCommitGraph2();
    // Add class/id to nodes for highlight
    const graphDiv = document.getElementById('commit-graph-container');
    if (!graphDiv) return;
    const circles = graphDiv.querySelectorAll('circle');
    circles.forEach((circle, idx) => {
        const commit = commitGraph[idx];
        circle.setAttribute('id', 'commit-node-' + commit.id);
        circle.setAttribute('class', 'commit-node');
        circle.style.cursor = 'pointer';
        // Hover: highlight relatives and show explanation
        circle.onmouseenter = () => {
            explainCommit(commit);
            highlightCommitAndRelatives(commit);
            // Step-by-step tip
            const info = document.getElementById('commit-graph-info');
            if (info) info.innerHTML = `<b>Tip:</b> You are hovering over commit <b>${commit.id}</b> on branch <b>${commit.branch}</b>. Its parent and children are highlighted.`;
        };
        // Mouse leave: clear highlight and explanation
        circle.onmouseleave = () => {
            explainCommit(null);
            highlightCommitAndRelatives(null);
            const info = document.getElementById('commit-graph-info');
            if (info) info.innerHTML = `<b>What am I seeing?</b><br>Each circle is a commit. Lines show parent-child relationships. Colors represent branches. The gold border and 'HEAD' label show your current position. Click a commit for details.`;
        };
        // Click: lock explanation
        circle.onclick = () => {
            explainCommit(commit);
            highlightCommitAndRelatives(commit);
            const info = document.getElementById('commit-graph-info');
            if (info) info.innerHTML = `<b>Selected Commit:</b> <b>${commit.id}</b> on branch <b>${commit.branch}</b>. See details below.`;
        };
    });
    // Make HEAD and branch labels more prominent
    const texts = graphDiv.querySelectorAll('text');
    texts.forEach(t => {
        if (t.textContent.includes('HEAD')) {
            t.style.fontWeight = 'bold';
            t.style.fontSize = '16px';
            t.style.textShadow = '0 1px 4px #fff';
        }
    });
}; 