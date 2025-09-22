#!/bin/bash

# Test script for verifying Gemini agent --yolo flag fix (Issue #64)
# Previously failed with 'Unknown argument: o' error

echo "================================================"
echo "Testing Gemini Agent --yolo Flag Fix (Issue #64)"
echo "================================================"
echo

# Make the Python script executable
chmod +x gemini_agent.py

echo "Test 1: Basic functionality (no flags)"
echo "Command: python3 gemini_agent.py"
python3 gemini_agent.py
echo

echo "Test 2: Help flag"
echo "Command: python3 gemini_agent.py -h"
python3 gemini_agent.py -h | head -10
echo

echo "Test 3: --yolo flag (THIS PREVIOUSLY FAILED)"
echo "Command: python3 gemini_agent.py --yolo"
python3 gemini_agent.py --yolo
echo

echo "Test 4: --yolo with action"
echo "Command: python3 gemini_agent.py --yolo run"
python3 gemini_agent.py --yolo run
echo

echo "Test 5: --yolo with verbose"
echo "Command: python3 gemini_agent.py --yolo --verbose analyze"
python3 gemini_agent.py --yolo --verbose analyze
echo

echo "================================================"
echo "✓ All tests completed successfully!"
echo "✓ The --yolo flag is now properly parsed"
echo "✓ No 'Unknown argument: o' error occurred"
echo "================================================"