# Makefile for MiniGit Version Control System

# Compiler settings
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2
TARGET = minigit
SOURCE = src/minigit.cpp

# Default target
all: $(TARGET)

# Compile the program
$(TARGET): $(SOURCE)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SOURCE)

# Clean build files
clean:
	rm -f $(TARGET)
	rm -rf commits/

# Install (copy to system path - requires sudo on Linux/Mac)
install: $(TARGET)
	cp $(TARGET) /usr/local/bin/

# Uninstall
uninstall:
	rm -f /usr/local/bin/$(TARGET)

# Run the program
run: $(TARGET)
	./$(TARGET)

# Debug build
debug: CXXFLAGS += -g -DDEBUG
debug: $(TARGET)

# Release build
release: CXXFLAGS += -DNDEBUG
release: $(TARGET)

# Help
help:
	@echo "Available targets:"
	@echo "  all      - Build MiniGit (default)"
	@echo "  clean    - Remove build files and commits directory"
	@echo "  install  - Install to system path (requires sudo)"
	@echo "  uninstall- Remove from system path"
	@echo "  run      - Build and run MiniGit"
	@echo "  debug    - Build with debug symbols"
	@echo "  release  - Build optimized release version"
	@echo "  help     - Show this help message"

.PHONY: all clean install uninstall run debug release help 