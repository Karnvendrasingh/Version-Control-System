#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <unordered_map>
#include <vector>
#include <stack>
#include <chrono>
#include <iomanip>
#include <algorithm>
#include <cstdio>
#include <cassert>
#include <set>

#ifdef _WIN32
#include <windows.h>
#include <direct.h>
#define CLEAR_SCREEN "cls"
#define MKDIR(dir) _mkdir(dir)
// ncurses is not natively available on Windows; recommend WSL or PDCurses for GUI
#else
#include <cstdlib>
#include <sys/stat.h>
#include <sys/types.h>
#define CLEAR_SCREEN "clear"
#define MKDIR(dir) mkdir(dir, 0755)
#include <ncurses.h>
#endif

using namespace std;

// ANSI color codes for terminal output
const string RESET = "\033[0m";
const string RED = "\033[31m";
const string GREEN = "\033[32m";
const string YELLOW = "\033[33m";
const string BLUE = "\033[34m";
const string MAGENTA = "\033[35m";
const string CYAN = "\033[36m";
const string WHITE = "\033[37m";
const string BOLD = "\033[1m";

// Commit Node structure using Singly Linked List
struct CommitNode {
    int commitId;
    string commitMessage;
    string timestamp;
    unordered_map<string, string> fileHashes;  // filename -> content hash
    CommitNode* next;
    
    CommitNode(int id, const string& message, const string& time) 
        : commitId(id), commitMessage(message), timestamp(time), next(nullptr) {}
};

// Branch structure
struct Branch {
    string name;
    CommitNode* head; // Head of the branch's commit list
    Branch(const string& n, CommitNode* h) : name(n), head(h) {}
};

// MiniGit Version Control System Class
class MiniGit {
private:
    CommitNode* head;
    CommitNode* currentCommit;
    unordered_map<string, string> stagingArea;  // filename -> content hash
    vector<string> trackedFiles;
    stack<CommitNode*> undoStack;
    stack<CommitNode*> redoStack;
    int nextCommitId;
    bool isInitialized;
    unordered_map<string, Branch*> branches; // branch name -> Branch*
    Branch* currentBranch = nullptr;
    string currentBranchName = "main";
    set<string> ignoredFiles;
    
    // Hash function for file content
    string hashContent(const string& content) {
        hash<string> hasher;
        return to_string(hasher(content));
    }
    
    // Read file content
    string readFileContent(const string& filename) {
        ifstream file(filename);
        if (!file.is_open()) {
            return "";
        }
        stringstream buffer;
        buffer << file.rdbuf();
        return buffer.str();
    }
    
    // Write file content
    void writeFileContent(const string& filename, const string& content) {
        ofstream file(filename);
        if (file.is_open()) {
            file << content;
            file.close();
        }
    }
    
    // Get current timestamp
    string getCurrentTimestamp() {
        auto now = chrono::system_clock::now();
        auto time_t = chrono::system_clock::to_time_t(now);
        stringstream ss;
        ss << put_time(localtime(&time_t), "%Y-%m-%d %H:%M:%S");
        return ss.str();
    }
    
    // Create commit directory and save files
    void saveCommitFiles(CommitNode* commit) {
        string commitDir = "commits/commit_" + to_string(commit->commitId);
        
        // Create directory if it doesn't exist
        MKDIR("commits");
        MKDIR(commitDir.c_str());
        
        for (const auto& filePair : commit->fileHashes) {
            string filename = filePair.first;
            string content = readFileContent(filename);
            string filePath = commitDir + "/" + filename;
            writeFileContent(filePath, content);
        }
    }
    
    // Restore files from commit
    void restoreCommitFiles(CommitNode* commit) {
        string commitDir = "commits/commit_" + to_string(commit->commitId);
        
        for (const auto& filePair : commit->fileHashes) {
            string filename = filePair.first;
            string filePath = commitDir + "/" + filename;
            string content = readFileContent(filePath);
            writeFileContent(filename, content);
        }
    }

    // Helper for JSON escaping
    string jsonEscape(const string& s) {
        string out;
        for (char c : s) {
            if (c == '\\') out += "\\\\";
            else if (c == '"') out += "\\\"";
            else if (c == '\n') out += "\\n";
            else out += c;
        }
        return out;
    }
    // Helper for JSON unescaping
    string jsonUnescape(const string& s) {
        string out;
        for (size_t i = 0; i < s.size(); ++i) {
            if (s[i] == '\\' && i + 1 < s.size()) {
                if (s[i+1] == 'n') { out += '\n'; ++i; }
                else if (s[i+1] == '\\') { out += '\\'; ++i; }
                else if (s[i+1] == '"') { out += '"'; ++i; }
                else out += s[i+1], ++i;
            } else {
                out += s[i];
            }
        }
        return out;
    }
    void loadIgnoreList(const string& filename = ".minigitignore") {
        ignoredFiles.clear();
        ifstream in(filename);
        if (!in.is_open()) return;
        string line;
        while (getline(in, line)) {
            if (!line.empty()) ignoredFiles.insert(line);
        }
        in.close();
    }
    void saveIgnoreList(const string& filename = ".minigitignore") {
        ofstream out(filename);
        for (const auto& f : ignoredFiles) out << f << "\n";
        out.close();
    }
public:
    MiniGit() : head(nullptr), currentCommit(nullptr), nextCommitId(1), isInitialized(false) {
        loadIgnoreList();
    }
    
    // Initialize the version control system
    void init() {
        if (isInitialized) {
            cout << YELLOW << "MiniGit is already initialized!" << RESET << endl;
            return;
        }
        
        MKDIR("commits");
        isInitialized = true;
        // Create default branch 'main'
        Branch* mainBranch = new Branch("main", nullptr);
        branches["main"] = mainBranch;
        currentBranch = mainBranch;
        currentBranchName = "main";
        cout << GREEN << "MiniGit initialized successfully!" << RESET << endl;
    }
    
    // Add file to staging area
    void add(const string& filename) {
        if (!isInitialized) {
            cout << RED << "Error: MiniGit not initialized. Run 'init' first." << RESET << endl;
            return;
        }
        if (ignoredFiles.count(filename)) {
            cout << YELLOW << "File '" << filename << "' is ignored and will not be added." << RESET << endl;
            return;
        }
        ifstream file(filename);
        if (!file.is_open()) {
            cout << RED << "Error: File '" << filename << "' not found." << RESET << endl;
            return;
        }
        file.close();
        
        string content = readFileContent(filename);
        string contentHash = hashContent(content);
        stagingArea[filename] = contentHash;
        
        if (find(trackedFiles.begin(), trackedFiles.end(), filename) == trackedFiles.end()) {
            trackedFiles.push_back(filename);
        }
        
        cout << GREEN << "Added '" << filename << "' to staging area." << RESET << endl;
    }
    
    // Commit staged files
    void commit(const string& message) {
        if (!isInitialized) {
            cout << RED << "Error: MiniGit not initialized. Run 'init' first." << RESET << endl;
            return;
        }
        
        if (stagingArea.empty()) {
            cout << YELLOW << "No files staged for commit." << RESET << endl;
            return;
        }
        
        // Remove ignored files from stagingArea before commit
        for (auto it = stagingArea.begin(); it != stagingArea.end(); ) {
            if (ignoredFiles.count(it->first)) it = stagingArea.erase(it);
            else ++it;
        }
        if (stagingArea.empty()) {
            cout << YELLOW << "No non-ignored files to commit." << RESET << endl;
            return;
        }

        CommitNode* newCommit = new CommitNode(nextCommitId, message, getCurrentTimestamp());
        newCommit->fileHashes = stagingArea;
        // Insert at head of current branch
        if (currentBranch->head == nullptr) {
            currentBranch->head = newCommit;
        } else {
            newCommit->next = currentBranch->head;
            currentBranch->head = newCommit;
        }
        head = currentBranch->head;
        currentCommit = newCommit;
        saveCommitFiles(newCommit);
        
        cout << GREEN << "Committed " << stagingArea.size() << " files with ID: " << nextCommitId << RESET << endl;
        cout << "Message: " << message << endl;
        
        stagingArea.clear();
        nextCommitId++;
        
        // Clear redo stack when new commit is made
        while (!redoStack.empty()) {
            redoStack.pop();
        }
        // Update branch pointer
        branches[currentBranchName]->head = currentCommit;
    }
    
    // Display commit history
    void log() {
        if (!isInitialized) {
            cout << RED << "Error: MiniGit not initialized. Run 'init' first." << RESET << endl;
            return;
        }
        
        if (!currentBranch || currentBranch->head == nullptr) {
            cout << YELLOW << "No commits found." << RESET << endl;
            return;
        }
        
        cout << CYAN << "\n=== Commit History (branch: " << currentBranchName << ") ===" << RESET << endl;
        CommitNode* current = currentBranch->head;
        while (current != nullptr) {
            cout << BOLD << "Commit " << current->commitId << RESET << endl;
            cout << "Message: " << current->commitMessage << endl;
            cout << "Timestamp: " << current->timestamp << endl;
            cout << "Files: ";
            for (const auto& file : current->fileHashes) {
                cout << file.first << " ";
            }
            cout << "\n" << string(40, '-') << endl;
            current = current->next;
        }
    }
    
    // Checkout to a specific commit
    void checkout(int commitId) {
        if (!isInitialized) {
            cout << RED << "Error: MiniGit not initialized. Run 'init' first." << RESET << endl;
            return;
        }
        
        CommitNode* targetCommit = nullptr;
        CommitNode* current = head; // Start searching from the head of the current branch
        
        while (current != nullptr) {
            if (current->commitId == commitId) {
                targetCommit = current;
                break;
            }
            current = current->next;
        }
        
        if (targetCommit == nullptr) {
            cout << RED << "Error: Commit " << commitId << " not found." << RESET << endl;
            return;
        }
        
        // Save current state for undo
        if (currentCommit != nullptr) {
            undoStack.push(currentCommit);
        }
        
        restoreCommitFiles(targetCommit);
        currentCommit = targetCommit;
        
        cout << GREEN << "Checked out to commit " << commitId << RESET << endl;
    }
    
    // Show status of files
    void status() {
        if (!isInitialized) {
            cout << RED << "Error: MiniGit not initialized. Run 'init' first." << RESET << endl;
            return;
        }
        
        cout << CYAN << "\n=== Status ===" << RESET << endl;
        
        // Show staged files
        if (!stagingArea.empty()) {
            cout << GREEN << "Staged files:" << RESET << endl;
            for (const auto& file : stagingArea) {
                cout << "  " << file.first << endl;
            }
        } else {
            cout << YELLOW << "No staged files." << RESET << endl;
        }
        
        // Show tracked files
        cout << "\n" << BLUE << "Tracked files:" << RESET << endl;
        for (const string& filename : trackedFiles) {
            string currentContent = readFileContent(filename);
            string currentHash = hashContent(currentContent);
            
            if (currentCommit != nullptr && currentCommit->fileHashes.find(filename) != currentCommit->fileHashes.end()) {
                if (currentHash != currentCommit->fileHashes[filename]) {
                    cout << "  " << RED << filename << " (modified)" << RESET << endl;
                } else {
                    cout << "  " << GREEN << filename << " (unchanged)" << RESET << endl;
                }
            } else {
                cout << "  " << YELLOW << filename << " (untracked)" << RESET << endl;
            }
        }
        
        if (currentCommit != nullptr) {
            cout << "\n" << MAGENTA << "Current commit: " << currentCommit->commitId << RESET << endl;
        }
    }
    
    // Undo last checkout
    void undo() {
        if (undoStack.empty()) {
            cout << YELLOW << "Nothing to undo." << RESET << endl;
            return;
        }
        
        if (currentCommit != nullptr) {
            redoStack.push(currentCommit);
        }
        
        CommitNode* previousCommit = undoStack.top();
        undoStack.pop();
        
        restoreCommitFiles(previousCommit);
        currentCommit = previousCommit;
        
        cout << GREEN << "Undone to commit " << previousCommit->commitId << RESET << endl;
    }
    
    // Redo last undo
    void redo() {
        if (redoStack.empty()) {
            cout << YELLOW << "Nothing to redo." << RESET << endl;
            return;
        }
        
        if (currentCommit != nullptr) {
            undoStack.push(currentCommit);
        }
        
        CommitNode* nextCommit = redoStack.top();
        redoStack.pop();
        
        restoreCommitFiles(nextCommit);
        currentCommit = nextCommit;
        
        cout << GREEN << "Redone to commit " << nextCommit->commitId << RESET << endl;
    }
    
    // Show differences between current and last commit
    void diff() {
        if (!isInitialized || currentCommit == nullptr) {
            cout << YELLOW << "No previous commit to compare with." << RESET << endl;
            return;
        }
        
        cout << CYAN << "\n=== File Differences ===" << RESET << endl;
        
        for (const string& filename : trackedFiles) {
            string currentContent = readFileContent(filename);
            string currentHash = hashContent(currentContent);
            
            if (currentCommit->fileHashes.find(filename) != currentCommit->fileHashes.end()) {
                if (currentHash != currentCommit->fileHashes[filename]) {
                    cout << RED << filename << " - MODIFIED" << RESET << endl;
                } else {
                    cout << GREEN << filename << " - UNCHANGED" << RESET << endl;
                }
            } else {
                cout << YELLOW << filename << " - NEW FILE" << RESET << endl;
            }
        }
    }

    // Create a new branch from current commit
    void createBranch(const string& name) {
        if (!isInitialized) {
            cout << RED << "Error: MiniGit not initialized. Run 'init' first." << RESET << endl;
            return;
        }
        if (branches.find(name) != branches.end()) {
            cout << YELLOW << "Branch '" << name << "' already exists." << RESET << endl;
            return;
        }
        // New branch points to current head (shared history)
        Branch* newBranch = new Branch(name, currentCommit);
        branches[name] = newBranch;
        cout << GREEN << "Created branch '" << name << "' at commit "
             << (currentCommit ? to_string(currentCommit->commitId) : "(none)") << RESET << endl;
    }
    // Switch to another branch
    void switchBranch(const string& name) {
        if (!isInitialized) {
            cout << RED << "Error: MiniGit not initialized. Run 'init' first." << RESET << endl;
            return;
        }
        auto it = branches.find(name);
        if (it == branches.end()) {
            cout << RED << "Error: Branch '" << name << "' does not exist." << RESET << endl;
            return;
        }
        currentBranch = it->second;
        currentBranchName = name;
        head = currentBranch->head;
        currentCommit = head;
        if (currentCommit) restoreCommitFiles(currentCommit);
        cout << GREEN << "Switched to branch '" << name << "'" << RESET << endl;
    }
    // List all branches
    void listBranches() {
        if (!isInitialized) {
            cout << RED << "Error: MiniGit not initialized. Run 'init' first." << RESET << endl;
            return;
        }
        cout << CYAN << "\n=== Branches ===" << RESET << endl;
        for (const auto& pair : branches) {
            if (pair.first == currentBranchName)
                cout << BOLD << GREEN << "* " << pair.first << RESET << endl;
            else
                cout << "  " << pair.first << endl;
        }
    }
    // Merge another branch into the current branch (fast-forward only)
    void mergeBranch(const string& name) {
        if (!isInitialized) {
            cout << RED << "Error: MiniGit not initialized. Run 'init' first." << RESET << endl;
            return;
        }
        if (name == currentBranchName) {
            cout << YELLOW << "Cannot merge branch into itself." << RESET << endl;
            return;
        }
        auto it = branches.find(name);
        if (it == branches.end()) {
            cout << RED << "Error: Branch '" << name << "' does not exist." << RESET << endl;
            return;
        }
        Branch* other = it->second;
        if (!other->head) {
            cout << YELLOW << "Branch '" << name << "' has no commits to merge." << RESET << endl;
            return;
        }
        // Fast-forward: if current branch is behind, just point to other's head
        if (!currentBranch->head || isAncestor(currentBranch->head, other->head)) {
            currentBranch->head = other->head;
            head = currentBranch->head;
            currentCommit = head;
            restoreCommitFiles(currentCommit);
            cout << GREEN << "Fast-forward merged branch '" << name << "' into '" << currentBranchName << "'" << RESET << endl;
        } else {
            cout << YELLOW << "Non-fast-forward merges are not supported yet." << RESET << endl;
        }
    }
    // Helper: check if ancestor
    bool isAncestor(CommitNode* ancestor, CommitNode* descendant) {
        CommitNode* cur = descendant;
        while (cur) {
            if (cur == ancestor) return true;
            cur = cur->next;
        }
        return false;
    }
    
    // Show help
    void help() {
        cout << CYAN << "\n=== MiniGit Commands ===" << RESET << endl;
        cout << "init                    - Initialize MiniGit repository" << endl;
        cout << "add <filename>          - Add file to staging area (skips ignored files)" << endl;
        cout << "commit -m \"message\"     - Commit staged files (skips ignored files)" << endl;
        cout << "log                     - Show commit history for current branch" << endl;
        cout << "status                  - Show current status" << endl;
        cout << "checkout <id>           - Checkout to specific commit" << endl;
        cout << "\nBranching:" << endl;
        cout << "branch <name>           - Create a new branch" << endl;
        cout << "checkout-branch <name>  - Switch to a branch" << endl;
        cout << "list-branches           - List all branches" << endl;
        cout << "merge <name>            - Merge branch into current branch (fast-forward only)" << endl;
        cout << "\nSession Persistence:" << endl;
        cout << "save-session            - Save current session to file" << endl;
        cout << "load-session            - Load session from file" << endl;
        cout << "\nFile Integrity Checking:" << endl;
        cout << "verify <filename>       - Check if a tracked file is modified or new" << endl;
        cout << "verify-all              - Check all tracked files for integrity" << endl;
        cout << "\nIgnore Files:" << endl;
        cout << "ignore <filename>       - Add file to ignore list (.minigitignore)" << endl;
        cout << "unignore <filename>     - Remove file from ignore list" << endl;
        cout << "show-ignore             - List all ignored files" << endl;
        cout << "\nTesting:" << endl;
        cout << "test-all                - Run all unit tests" << endl;
        cout << "test <module>           - Run a specific test (init, add, commit, log, checkout)" << endl;
        cout << "\nUser Interface:" << endl;
        cout << "gui                     - Launch terminal-based UI (TUI)" << endl;
        cout << "\nOther:" << endl;
        cout << "undo                    - Undo last checkout" << endl;
        cout << "redo                    - Redo last undo" << endl;
        cout << "diff                    - Show file differences" << endl;
        cout << "help                    - Show this help message" << endl;
        cout << "exit                    - Exit MiniGit" << endl;
    }
    
    // Save session to file
    void saveSession(const string& filename = ".minigitdata.json") {
        ofstream out(filename);
        if (!out.is_open()) {
            cout << RED << "Error: Could not open file for saving session." << RESET << endl;
            return;
        }
        out << "{\n";
        out << "  \"nextCommitId\": " << nextCommitId << ",\n";
        out << "  \"currentBranch\": \"" << jsonEscape(currentBranchName) << "\",\n";
        // Tracked files
        out << "  \"trackedFiles\": [";
        for (size_t i = 0; i < trackedFiles.size(); ++i) {
            if (i > 0) out << ", ";
            out << "\"" << jsonEscape(trackedFiles[i]) << "\"";
        }
        out << "],\n";
        // Staging area
        out << "  \"stagingArea\": {";
        size_t cnt = 0;
        for (const auto& p : stagingArea) {
            if (cnt++ > 0) out << ", ";
            out << "\"" << jsonEscape(p.first) << "\": \"" << jsonEscape(p.second) << "\"";
        }
        out << "},\n";
        // Branches
        out << "  \"branches\": [\n";
        size_t bcnt = 0;
        for (const auto& bpair : branches) {
            if (bcnt++ > 0) out << ",\n";
            out << "    {\n";
            out << "      \"name\": \"" << jsonEscape(bpair.first) << "\",\n";
            out << "      \"headId\": " << (bpair.second->head ? bpair.second->head->commitId : 0) << "\n";
            out << "    }";
        }
        out << "\n  ],\n";
        // Commits
        // Collect all commits (avoid duplicates)
        unordered_map<int, CommitNode*> allCommits;
        for (const auto& bpair : branches) {
            CommitNode* cur = bpair.second->head;
            while (cur) {
                if (allCommits.count(cur->commitId)) break;
                allCommits[cur->commitId] = cur;
                cur = cur->next;
            }
        }
        out << "  \"commits\": [\n";
        size_t ccnt = 0;
        for (const auto& cpair : allCommits) {
            CommitNode* c = cpair.second;
            if (ccnt++ > 0) out << ",\n";
            out << "    {\n";
            out << "      \"id\": " << c->commitId << ",\n";
            out << "      \"message\": \"" << jsonEscape(c->commitMessage) << "\",\n";
            out << "      \"timestamp\": \"" << jsonEscape(c->timestamp) << "\",\n";
            out << "      \"fileHashes\": {";
            size_t fhcnt = 0;
            for (const auto& fh : c->fileHashes) {
                if (fhcnt++ > 0) out << ", ";
                out << "\"" << jsonEscape(fh.first) << "\": \"" << jsonEscape(fh.second) << "\"";
            }
            out << "},\n";
            out << "      \"nextId\": " << (c->next ? c->next->commitId : 0) << "\n";
            out << "    }";
        }
        out << "\n  ]\n";
        out << "}\n";
        out.close();
        cout << GREEN << "Session saved to '" << filename << "'" << RESET << endl;
    }
    // Load session from file
    void loadSession(const string& filename = ".minigitdata.json") {
        ifstream in(filename);
        if (!in.is_open()) {
            cout << YELLOW << "No session file found to load." << RESET << endl;
            return;
        }
        // Clear current state
        for (auto& b : branches) delete b.second;
        branches.clear();
        trackedFiles.clear();
        stagingArea.clear();
        head = nullptr;
        currentCommit = nullptr;
        currentBranch = nullptr;
        nextCommitId = 1;
        isInitialized = true;
        // Read file into string
        stringstream buffer;
        buffer << in.rdbuf();
        string data = buffer.str();
        in.close();
        // Simple parsing (not robust, but works for this structure)
        // Parse nextCommitId
        size_t pos = data.find("\"nextCommitId\": ");
        if (pos != string::npos) {
            size_t end = data.find(',', pos);
            nextCommitId = stoi(data.substr(pos + 16, end - pos - 16));
        }
        // Parse currentBranch
        pos = data.find("\"currentBranch\": ");
        if (pos != string::npos) {
            size_t start = data.find('"', pos + 18) + 1;
            size_t end = data.find('"', start);
            currentBranchName = jsonUnescape(data.substr(start, end - start));
        }
        // Parse trackedFiles
        pos = data.find("\"trackedFiles\": [");
        if (pos != string::npos) {
            size_t start = data.find('[', pos) + 1;
            size_t end = data.find(']', start);
            string tf = data.substr(start, end - start);
            trackedFiles.clear();
            size_t tfpos = 0;
            while ((tfpos = tf.find('"')) != string::npos) {
                size_t tfend = tf.find('"', tfpos + 1);
                if (tfend == string::npos) break;
                trackedFiles.push_back(jsonUnescape(tf.substr(tfpos + 1, tfend - tfpos - 1)));
                tf = tf.substr(tfend + 1);
            }
        }
        // Parse stagingArea
        pos = data.find("\"stagingArea\": {");
        if (pos != string::npos) {
            size_t start = data.find('{', pos) + 1;
            size_t end = data.find('}', start);
            string sa = data.substr(start, end - start);
            stagingArea.clear();
            size_t sapos = 0;
            while ((sapos = sa.find('"')) != string::npos) {
                size_t saend = sa.find('"', sapos + 1);
                if (saend == string::npos) break;
                string key = jsonUnescape(sa.substr(sapos + 1, saend - sapos - 1));
                size_t colon = sa.find(':', saend);
                size_t valstart = sa.find('"', colon) + 1;
                size_t valend = sa.find('"', valstart);
                string val = jsonUnescape(sa.substr(valstart, valend - valstart));
                stagingArea[key] = val;
                sa = sa.substr(valend + 1);
            }
        }
        // Parse commits
        unordered_map<int, CommitNode*> commitMap;
        pos = data.find("\"commits\": [");
        if (pos != string::npos) {
            size_t start = data.find('[', pos) + 1;
            size_t end = data.find(']', start);
            string cs = data.substr(start, end - start);
            size_t cpos = 0;
            while ((cpos = cs.find("{", cpos)) != string::npos) {
                int id = 0, nextId = 0;
                string msg, ts;
                unordered_map<string, string> fh;
                // id
                size_t idpos = cs.find("\"id\": ", cpos);
                if (idpos != string::npos) id = stoi(cs.substr(idpos + 6));
                // message
                size_t mpos = cs.find("\"message\": ", cpos);
                if (mpos != string::npos) {
                    size_t mstart = cs.find('"', mpos + 11) + 1;
                    size_t mend = cs.find('"', mstart);
                    msg = jsonUnescape(cs.substr(mstart, mend - mstart));
                }
                // timestamp
                size_t tpos = cs.find("\"timestamp\": ", cpos);
                if (tpos != string::npos) {
                    size_t tstart = cs.find('"', tpos + 13) + 1;
                    size_t tend = cs.find('"', tstart);
                    ts = jsonUnescape(cs.substr(tstart, tend - tstart));
                }
                // fileHashes
                size_t fhpos = cs.find("\"fileHashes\": {", cpos);
                if (fhpos != string::npos) {
                    size_t fhstart = cs.find('{', fhpos) + 1;
                    size_t fhend = cs.find('}', fhstart);
                    string fhs = cs.substr(fhstart, fhend - fhstart);
                    size_t fpos = 0;
                    while ((fpos = fhs.find('"')) != string::npos) {
                        size_t fend = fhs.find('"', fpos + 1);
                        if (fend == string::npos) break;
                        string k = jsonUnescape(fhs.substr(fpos + 1, fend - fpos - 1));
                        size_t colon = fhs.find(':', fend);
                        size_t vstart = fhs.find('"', colon) + 1;
                        size_t vend = fhs.find('"', vstart);
                        string v = jsonUnescape(fhs.substr(vstart, vend - vstart));
                        fh[k] = v;
                        fhs = fhs.substr(vend + 1);
                    }
                }
                // nextId
                size_t npos = cs.find("\"nextId\": ", cpos);
                if (npos != string::npos) nextId = stoi(cs.substr(npos + 10));
                CommitNode* node = new CommitNode(id, msg, ts);
                node->fileHashes = fh;
                commitMap[id] = node;
                // Link next pointer later
                cpos = cs.find('}', cpos) + 1;
            }
            // Link next pointers
            for (auto& p : commitMap) {
                size_t npos = data.find("\"id\": " + to_string(p.first));
                size_t nextpos = data.find("\"nextId\": ", npos);
                if (nextpos != string::npos) {
                    int nextId = stoi(data.substr(nextpos + 10));
                    if (nextId && commitMap.count(nextId)) {
                        p.second->next = commitMap[nextId];
                    }
                }
            }
        }
        // Parse branches
        pos = data.find("\"branches\": [");
        if (pos != string::npos) {
            size_t start = data.find('[', pos) + 1;
            size_t end = data.find(']', start);
            string bs = data.substr(start, end - start);
            size_t bpos = 0;
            while ((bpos = bs.find("{", bpos)) != string::npos) {
                string bname;
                int headId = 0;
                size_t npos = bs.find("\"name\": ", bpos);
                if (npos != string::npos) {
                    size_t nstart = bs.find('"', npos + 8) + 1;
                    size_t nend = bs.find('"', nstart);
                    bname = jsonUnescape(bs.substr(nstart, nend - nstart));
                }
                size_t hpos = bs.find("\"headId\": ", bpos);
                if (hpos != string::npos) {
                    headId = stoi(bs.substr(hpos + 10));
                }
                Branch* br = new Branch(bname, headId ? commitMap[headId] : nullptr);
                branches[bname] = br;
                bpos = bs.find('}', bpos) + 1;
            }
        }
        // Set current branch
        auto it = branches.find(currentBranchName);
        if (it != branches.end()) {
            currentBranch = it->second;
            head = currentBranch->head;
            currentCommit = head;
        }
        cout << GREEN << "Session loaded from '" << filename << "'" << RESET << endl;
    }
    
    // Verify a single file's integrity
    void verifyFile(const string& filename) {
        if (!isInitialized) {
            cout << RED << "Error: MiniGit not initialized. Run 'init' first." << RESET << endl;
            return;
        }
        if (!currentCommit) {
            cout << YELLOW << "No commits to verify against." << RESET << endl;
            return;
        }
        auto it = currentCommit->fileHashes.find(filename);
        if (it == currentCommit->fileHashes.end()) {
            cout << YELLOW << filename << ": NEW (not in latest commit)" << RESET << endl;
            return;
        }
        string currentContent = readFileContent(filename);
        string currentHash = hashContent(currentContent);
        if (currentHash == it->second) {
            cout << GREEN << filename << ": UNTOUCHED" << RESET << endl;
        } else {
            cout << RED << filename << ": MODIFIED" << RESET << endl;
        }
    }
    // Verify all tracked files
    void verifyAll() {
        if (!isInitialized) {
            cout << RED << "Error: MiniGit not initialized. Run 'init' first." << RESET << endl;
            return;
        }
        if (!currentCommit) {
            cout << YELLOW << "No commits to verify against." << RESET << endl;
            return;
        }
        cout << CYAN << "\n=== File Integrity Check ===" << RESET << endl;
        for (const string& filename : trackedFiles) {
            verifyFile(filename);
        }
    }
    
    // Destructor to free memory
    ~MiniGit() {
        CommitNode* current = head;
        while (current != nullptr) {
            CommitNode* next = current->next;
            delete current;
            current = next;
        }
        for (auto& pair : branches) {
            delete pair.second;
        }
    }
    void ignoreFile(const string& filename) {
        ignoredFiles.insert(filename);
        saveIgnoreList();
        cout << YELLOW << "Ignored file: " << filename << RESET << endl;
    }
    void unignoreFile(const string& filename) {
        if (ignoredFiles.erase(filename)) {
            saveIgnoreList();
            cout << GREEN << "Unignored file: " << filename << RESET << endl;
        } else {
            cout << YELLOW << "File not in ignore list: " << filename << RESET << endl;
        }
    }
    void showIgnore() {
        cout << CYAN << "\n=== Ignored Files ===" << RESET << endl;
        if (ignoredFiles.empty()) cout << YELLOW << "(none)" << RESET << endl;
        for (const auto& f : ignoredFiles) cout << f << endl;
    }
#ifndef _WIN32
    // Simple ncurses-based TUI
    void runTUI() {
        initscr();
        noecho();
        cbreak();
        keypad(stdscr, TRUE);
        curs_set(0);
        const char* menu[] = {"Add file", "Commit", "Log", "Status", "Checkout", "Exit GUI"};
        int n_options = 6;
        int highlight = 0;
        int choice = 0;
        while (1) {
            clear();
            mvprintw(0, 2, "MiniGit TUI - Use arrow keys, Enter to select");
            for (int i = 0; i < n_options; ++i) {
                if (i == highlight) attron(A_REVERSE);
                mvprintw(i + 2, 4, menu[i]);
                if (i == highlight) attroff(A_REVERSE);
            }
            int c = getch();
            if (c == KEY_UP) highlight = (highlight - 1 + n_options) % n_options;
            else if (c == KEY_DOWN) highlight = (highlight + 1) % n_options;
            else if (c == '\n' || c == KEY_ENTER || c == 10) {
                choice = highlight;
                clear();
                if (choice == 0) { // Add file
                    echo();
                    char fname[256];
                    mvprintw(2, 2, "Enter filename to add: ");
                    getnstr(fname, 255);
                    noecho();
                    add(fname);
                    mvprintw(4, 2, "Press any key to continue...");
                    getch();
                } else if (choice == 1) { // Commit
                    echo();
                    char msg[256];
                    mvprintw(2, 2, "Enter commit message: ");
                    getnstr(msg, 255);
                    noecho();
                    commit(msg);
                    mvprintw(4, 2, "Press any key to continue...");
                    getch();
                } else if (choice == 2) { // Log
                    // Redirect log output to a stringstream
                    FILE* old = freopen("/dev/tty", "w", stdout);
                    log();
                    mvprintw(15, 2, "Press any key to continue...");
                    getch();
                } else if (choice == 3) { // Status
                    FILE* old = freopen("/dev/tty", "w", stdout);
                    status();
                    mvprintw(15, 2, "Press any key to continue...");
                    getch();
                } else if (choice == 4) { // Checkout
                    echo();
                    char idstr[32];
                    mvprintw(2, 2, "Enter commit ID to checkout: ");
                    getnstr(idstr, 31);
                    noecho();
                    int id = atoi(idstr);
                    checkout(id);
                    mvprintw(4, 2, "Press any key to continue...");
                    getch();
                } else if (choice == 5) { // Exit
                    break;
                }
            }
        }
        endwin();
    }
#endif
};

// Test functions for MiniGit
void testInit(bool& pass) {
    MiniGit mg;
    mg.init();
    if (mg.isInitialized) {
        cout << "testInit: PASS" << endl;
        pass = true;
    } else {
        cout << "testInit: FAIL" << endl;
        pass = false;
    }
}
void testAdd(bool& pass) {
    MiniGit mg;
    mg.init();
    ofstream f("testfile.txt"); f << "abc"; f.close();
    mg.add("testfile.txt");
    if (!mg.stagingArea.empty() && mg.stagingArea.count("testfile.txt")) {
        cout << "testAdd: PASS" << endl;
        pass = true;
    } else {
        cout << "testAdd: FAIL" << endl;
        pass = false;
    }
    remove("testfile.txt");
}
void testCommit(bool& pass) {
    MiniGit mg;
    mg.init();
    ofstream f("testfile.txt"); f << "abc"; f.close();
    mg.add("testfile.txt");
    mg.commit("msg");
    if (mg.currentCommit && mg.currentCommit->commitMessage == "msg") {
        cout << "testCommit: PASS" << endl;
        pass = true;
    } else {
        cout << "testCommit: FAIL" << endl;
        pass = false;
    }
    remove("testfile.txt");
}
void testLog(bool& pass) {
    MiniGit mg;
    mg.init();
    ofstream f("testfile.txt"); f << "abc"; f.close();
    mg.add("testfile.txt");
    mg.commit("msg");
    // Just check that log() doesn't crash
    try {
        mg.log();
        cout << "testLog: PASS" << endl;
        pass = true;
    } catch (...) {
        cout << "testLog: FAIL" << endl;
        pass = false;
    }
    remove("testfile.txt");
}
void testCheckout(bool& pass) {
    MiniGit mg;
    mg.init();
    ofstream f("testfile.txt"); f << "abc"; f.close();
    mg.add("testfile.txt");
    mg.commit("msg");
    int id = mg.currentCommit ? mg.currentCommit->commitId : -1;
    if (id == -1) { cout << "testCheckout: FAIL" << endl; pass = false; remove("testfile.txt"); return; }
    try {
        mg.checkout(id);
        cout << "testCheckout: PASS" << endl;
        pass = true;
    } catch (...) {
        cout << "testCheckout: FAIL" << endl;
        pass = false;
    }
    remove("testfile.txt");
}
void runAllTests() {
    bool pass = true;
    testInit(pass); testAdd(pass); testCommit(pass); testLog(pass); testCheckout(pass);
}
void runTest(const string& module) {
    bool pass = true;
    if (module == "init") testInit(pass);
    else if (module == "add") testAdd(pass);
    else if (module == "commit") testCommit(pass);
    else if (module == "log") testLog(pass);
    else if (module == "checkout") testCheckout(pass);
    else cout << "Unknown test module: " << module << endl;
}

// Main function
int main() {
    MiniGit minigit;
    string command;
    
    cout << BOLD << CYAN << "=== MiniGit - Lightweight Version Control System ===" << RESET << endl;
    cout << "Type 'help' for available commands.\n" << endl;
    
    while (true) {
        cout << BOLD << GREEN << "minigit> " << RESET;
        getline(cin, command);
        
        if (command == "exit") {
            cout << "Goodbye!" << endl;
            break;
        } else if (command == "help") {
            minigit.help();
        } else if (command == "init") {
            minigit.init();
        } else if (command.substr(0, 3) == "add") {
            if (command.length() > 4) {
                string filename = command.substr(4);
                filename.erase(0, filename.find_first_not_of(" \t"));
                if (!filename.empty()) {
                    ifstream f(filename);
                    if (!f.is_open()) {
                        cout << RED << "Error: File '" << filename << "' not found." << RESET << endl;
                    } else {
                        minigit.add(filename);
                    }
                } else {
                    cout << RED << "Error: Please specify a filename." << RESET << endl;
                }
            } else {
                cout << RED << "Error: Please specify a filename." << RESET << endl;
            }
        } else if (command.substr(0, 6) == "commit") {
            if (command.length() > 8 && command.substr(7, 2) == "-m") {
                string message = command.substr(10);
                if (message.length() > 2) {
                    if (message.front() == '"' && message.back() == '"') {
                        message = message.substr(1, message.length() - 2);
                    }
                    minigit.commit(message);
                } else {
                    cout << RED << "Error: Please provide a commit message." << RESET << endl;
                }
            } else {
                cout << RED << "Error: Use 'commit -m \"message\"'" << RESET << endl;
            }
        } else if (command == "log") {
            minigit.log();
        } else if (command.substr(0, 8) == "checkout") {
            if (command.length() > 9) {
                try {
                    string commitIdStr = command.substr(9);
                    commitIdStr.erase(0, commitIdStr.find_first_not_of(" \t"));
                    int commitId = stoi(commitIdStr);
                    if (!minigit.currentBranch || !minigit.currentBranch->head) {
                        cout << RED << "Error: No commits available for checkout." << RESET << endl;
                    } else {
                        bool found = false;
                        CommitNode* cur = minigit.currentBranch->head;
                        while (cur) {
                            if (cur->commitId == commitId) { found = true; break; }
                            cur = cur->next;
                        }
                        if (!found) {
                            cout << RED << "Error: Commit ID '" << commitId << "' not found in current branch." << RESET << endl;
                        } else {
                            minigit.checkout(commitId);
                        }
                    }
                } catch (...) {
                    cout << RED << "Error: Invalid commit ID." << RESET << endl;
                }
            } else {
                cout << RED << "Error: Please specify a commit ID." << RESET << endl;
            }
        } else if (command.substr(0, 6) == "branch") {
            if (command.length() > 7) {
                string branchName = command.substr(7);
                branchName.erase(0, branchName.find_first_not_of(" \t"));
                if (!branchName.empty()) {
                    minigit.createBranch(branchName);
                } else {
                    cout << RED << "Error: Please specify a branch name." << RESET << endl;
                }
            } else {
                cout << RED << "Error: Please specify a branch name." << RESET << endl;
            }
        } else if (command.substr(0, 15) == "checkout-branch") {
            if (command.length() > 16) {
                string branchName = command.substr(16);
                branchName.erase(0, branchName.find_first_not_of(" \t"));
                if (!branchName.empty()) {
                    minigit.switchBranch(branchName);
                } else {
                    cout << RED << "Error: Please specify a branch name." << RESET << endl;
                }
            } else {
                cout << RED << "Error: Please specify a branch name." << RESET << endl;
            }
        } else if (command == "list-branches") {
            minigit.listBranches();
        } else if (command.substr(0, 5) == "merge") {
            if (command.length() > 6) {
                string branchName = command.substr(6);
                branchName.erase(0, branchName.find_first_not_of(" \t"));
                if (!branchName.empty()) {
                    minigit.mergeBranch(branchName);
                } else {
                    cout << RED << "Error: Please specify a branch name." << RESET << endl;
                }
            } else {
                cout << RED << "Error: Please specify a branch name." << RESET << endl;
            }
        } else if (command == "status") {
            minigit.status();
        } else if (command == "undo") {
            minigit.undo();
        } else if (command == "redo") {
            minigit.redo();
        } else if (command == "diff") {
            minigit.diff();
        } else if (command == "verify") {
            cout << RED << "Error: Please specify a filename." << RESET << endl;
        } else if (command.substr(0, 6) == "verify") {
            if (command.length() > 7) {
                string filename = command.substr(7);
                filename.erase(0, filename.find_first_not_of(" \t"));
                if (!filename.empty()) {
                    minigit.verifyFile(filename);
                } else {
                    cout << RED << "Error: Please specify a filename." << RESET << endl;
                }
            } else {
                cout << RED << "Error: Please specify a filename." << RESET << endl;
            }
        } else if (command == "verify-all") {
            minigit.verifyAll();
        } else if (command == "save-session") {
            minigit.saveSession();
        } else if (command == "load-session") {
            minigit.loadSession();
        } else if (command == "gui") {
            minigit.runTUI();
        } else if (command == "test-all") {
            runAllTests();
        } else if (command.substr(0, 4) == "test") {
            if (command.length() > 5) {
                string module = command.substr(5);
                module.erase(0, module.find_first_not_of(" \t"));
                if (!module.empty()) {
                    runTest(module);
                } else {
                    cout << RED << "Error: Please specify a test module (init, add, commit, log, checkout)." << RESET << endl;
                }
            } else {
                cout << RED << "Error: Please specify a test module (init, add, commit, log, checkout)." << RESET << endl;
            }
        } else if (command == "ignore") {
            if (command.length() > 7) {
                string filename = command.substr(7);
                filename.erase(0, filename.find_first_not_of(" \t"));
                if (!filename.empty()) {
                    minigit.ignoreFile(filename);
                } else {
                    cout << RED << "Error: Please specify a filename." << RESET << endl;
                }
            } else {
                cout << RED << "Error: Please specify a filename." << RESET << endl;
            }
        } else if (command == "unignore") {
            if (command.length() > 9) {
                string filename = command.substr(9);
                filename.erase(0, filename.find_first_not_of(" \t"));
                if (!filename.empty()) {
                    minigit.unignoreFile(filename);
                } else {
                    cout << RED << "Error: Please specify a filename." << RESET << endl;
                }
            } else {
                cout << RED << "Error: Please specify a filename." << RESET << endl;
            }
        } else if (command == "show-ignore") {
            minigit.showIgnore();
        } else if (!command.empty()) {
            cout << RED << "Unknown command: " << command << RESET << endl;
            cout << "Type 'help' for available commands." << endl;
        }
    }
    
    return 0;
} 