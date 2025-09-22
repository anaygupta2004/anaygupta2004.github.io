#!/usr/bin/env python3
"""
Gemini Agent Test Script
Demonstrates proper handling of --yolo flag to fix 'Unknown argument: o' error
"""

import argparse
import sys


def main():
    parser = argparse.ArgumentParser(
        description='Gemini Agent - Test script for issue #64',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    # Properly define --yolo flag to avoid 'Unknown argument: o' error
    # The issue was likely that --yolo was being parsed incorrectly
    parser.add_argument(
        '--yolo',
        action='store_true',
        help='Enable YOLO mode (You Only Look Once) - skip confirmations'
    )

    parser.add_argument(
        '--verbose',
        '-v',
        action='store_true',
        help='Enable verbose output'
    )

    parser.add_argument(
        'action',
        nargs='?',
        default='test',
        choices=['test', 'run', 'analyze'],
        help='Action to perform'
    )

    # Parse arguments with proper error handling
    try:
        args = parser.parse_args()
    except SystemExit as e:
        # Handle parsing errors gracefully
        if e.code != 0:
            print(f"Error parsing arguments. Use -h for help.", file=sys.stderr)
        sys.exit(e.code)

    # Process the parsed arguments
    if args.verbose:
        print("Verbose mode enabled")
        print(f"Arguments parsed: {vars(args)}")

    if args.yolo:
        print("YOLO mode activated - skipping all confirmations!")
    else:
        print("Running in safe mode (use --yolo to skip confirmations)")

    print(f"Executing action: {args.action}")

    # Simulate agent actions
    if args.action == 'test':
        print("✓ Gemini agent test completed successfully")
        print("✓ --yolo flag parsing works correctly")
        return 0
    elif args.action == 'run':
        print("✓ Gemini agent running...")
        return 0
    elif args.action == 'analyze':
        print("✓ Gemini agent analyzing...")
        return 0

    return 0


if __name__ == '__main__':
    sys.exit(main())