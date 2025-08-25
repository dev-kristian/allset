#!/usr/bin/env python3

import os
import sys
import subprocess
import argparse
import fnmatch
from collections import Counter
import glob

# --- Configuration ---

# Default patterns to ignore. Crucially, these now include directory patterns
# ending with a slash to enable efficient directory pruning.
DEFAULT_IGNORE_PATTERNS = [
    # Directories
    ".git/",
    ".next/",
    ".venv/",
    "venv/",
    "__pycache__/",
    "node_modules/",
    "build/",
    "dist/",
    ".DS_Store",
    # Files
    "*.pyc", "*.pyo", "*.o", "*.so", "*.a", "*.dll", "*.exe","*.md"
    "*.db", "*.sqlite", "*.sqlite3",
    "*.lock", "poetry.lock", "pnpm-lock.yaml", "package-lock.json", "yarn.lock",
    "*.swp", "*.swo", "*.swn",
    "*.egg-info", "*.dist-info",
    # Media and large files
    "*.jpg", "*.jpeg", "*.png", "*.gif", "*.bmp", "*.tiff", "*.ico",
    "*.mp3", "*.wav", "*.flac",
    "*.mp4", "*.avi", "*.mov", "*.mkv",
    "*.zip", "*.tar", "*.gz", "*.rar", "*.7z",
    "*.pdf", "*.doc", "*.docx", "*.xls", "*.xlsx", "*.ppt", "*.pptx",
    "*.iso", "*.img", "*.bin",
]

MAX_FILE_SIZE = 1 * 1024 * 1024  # 1 MB

# --- Helper Functions ---

def is_binary(filepath):
    """Heuristic to check if a file is binary."""
    try:
        with open(filepath, 'rb') as f:
            chunk = f.read(1024)
        if not chunk:
            return False
        if b'\0' in chunk:
            return True
        text_chars = bytearray({7, 8, 9, 10, 12, 13, 27} | set(range(0x20, 0x100)) - {0x7f})
        non_text_ratio = sum(1 for byte in chunk if byte not in text_chars) / len(chunk)
        return non_text_ratio > 0.3
    except IOError:
        return True

def get_git_root():
    """Finds the root directory of the Git repository."""
    try:
        return subprocess.check_output(
            ['git', 'rev-parse', '--show-toplevel'],
            stderr=subprocess.PIPE, text=True
        ).strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return os.getcwd()

def get_git_change_counts(repo_path):
    """Uses Git history to count file changes."""
    counts = Counter()
    try:
        all_git_files = subprocess.check_output(
            ['git', 'ls-files'], cwd=repo_path, text=True
        ).strip().split('\n')
        
        log_output = subprocess.check_output(
            ['git', 'log', '--pretty=format:', '--name-only'],
            cwd=repo_path, text=True
        )
        counts.update(log_output.strip().split('\n'))
        
        for f in all_git_files:
            if f not in counts:
                counts[f] = 0
                
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Warning: Not a Git repository or 'git' command not found. "
              "File importance will not be inferred from history.", file=sys.stderr)
        return {}
    return counts

def parse_gitignore(root_dir):
    """Parses all .gitignore files and returns a list of patterns."""
    patterns = []
    for dirpath, _, filenames in os.walk(root_dir):
        if '.gitignore' in filenames:
            gitignore_path = os.path.join(dirpath, '.gitignore')
            relative_dir = os.path.relpath(dirpath, root_dir)
            if relative_dir == '.':
                relative_dir = ''
            
            with open(gitignore_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        if line.endswith('/'):
                            patterns.append(os.path.join(relative_dir, line).replace(os.sep, '/'))
                        else:
                            patterns.append(os.path.join(relative_dir, line).replace(os.sep, '/'))
    return patterns

def find_files_to_include(paths, ignore_patterns, git_root):
    """Walks directories to find files, pruning ignored directories."""
    all_files = set()
    dir_ignore_patterns = [p for p in ignore_patterns if p.endswith('/')]
    file_ignore_patterns = [p for p in ignore_patterns if not p.endswith('/')]

    initial_search_paths = set()
    for path in paths:
        if os.path.isfile(path):
            initial_search_paths.add(path)
        elif os.path.isdir(path):
            initial_search_paths.add(path)
        else:
            for p in glob.glob(path, recursive=True):
                initial_search_paths.add(p)

    for search_path in initial_search_paths:
        if os.path.isfile(search_path):
            all_files.add(search_path)
            continue
            
        if not os.path.isdir(search_path):
            continue

        for dirpath, dirnames, filenames in os.walk(search_path, topdown=True):
            relative_dirpath = os.path.relpath(dirpath, git_root).replace(os.sep, '/') + '/'
            if relative_dirpath == './':
                relative_dirpath = ''

            original_dirs = dirnames[:]
            dirnames[:] = [] 
            for d in original_dirs:
                dir_to_check = relative_dirpath + d + '/'
                if not any(fnmatch.fnmatch(dir_to_check, pattern) for pattern in dir_ignore_patterns):
                    dirnames.append(d)
            
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)
                relative_filepath = os.path.relpath(filepath, git_root).replace(os.sep, '/')
                
                if not any(fnmatch.fnmatch(relative_filepath, pattern) for pattern in file_ignore_patterns):
                    all_files.add(filepath)
                    
    return list(all_files)


def main():
    parser = argparse.ArgumentParser(
        description="Packs a repository's source code into a single Markdown file for LLM consumption.",
        epilog="Example: python repomix.py . -o context.md -i 'tests/'"
    )
    parser.add_argument("paths", nargs='+', help="Paths to process (files, dirs, globs).")
    parser.add_argument("-o", "--output", default="repomix.md", help="Output file name.")
    parser.add_argument("-i", "--ignore", action="append", default=[], help="Add ignore glob pattern.")
    parser.add_argument("--max-size", type=int, default=MAX_FILE_SIZE, help=f"Max file size (bytes).")
    args = parser.parse_args()

    git_root = get_git_root()
    initial_dir = os.getcwd()
    os.chdir(git_root)

    print(f"Project root identified as: {git_root}", file=sys.stderr)

    change_counts = get_git_change_counts(git_root)
    gitignore_patterns = parse_gitignore(git_root)
    all_ignore_patterns = DEFAULT_IGNORE_PATTERNS + gitignore_patterns + args.ignore

    all_found_files = find_files_to_include(args.paths, all_ignore_patterns, git_root)

    included_files = []
    for filepath in all_found_files:
        relative_path = os.path.relpath(filepath, git_root).replace(os.sep, '/')
        
        try:
            if os.path.getsize(filepath) > args.max_size:
                print(f"Skipping large file: {relative_path}", file=sys.stderr)
                continue
        except OSError:
            continue

        if is_binary(filepath):
            print(f"Skipping binary file: {relative_path}", file=sys.stderr)
            continue
            
        included_files.append(relative_path)

    included_files.sort(key=lambda f: change_counts.get(f, 0))

    # --- Markdown Output Generation ---
    output_content = []
    
    # Header
    summary = (
        f"# Repository Snapshot: {os.path.basename(git_root)}\n\n"
        "This file is a merged representation of a subset of the codebase, containing files "
        "not matching ignore patterns, combined into a single document by the `repomix.py` script.\n\n"
        "- **Purpose**: To provide a comprehensive context for AI systems (like LLMs) for analysis, "
        "code review, or other automated processes.\n"
        f"- **Total Files**: {len(included_files)}\n"
        "- **Sorting**: Files are sorted by their Git change count, with the most frequently changed "
        "(and thus likely more important) files appearing at the end.\n\n"
        "---\n\n"
    )
    output_content.append(summary)

    # Directory Structure
    output_content.append("## Directory Structure\n\n")
    output_content.append("```\n")
    for path in sorted(included_files):
        output_content.append(f"{path}\n")
    output_content.append("```\n\n")
    output_content.append("---\n\n")

    # File Contents
    output_content.append("## File Contents\n\n")
    for filepath in included_files:
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Determine the language for syntax highlighting from file extension
            extension = os.path.splitext(filepath)[1].lstrip('.')
            
            output_content.append(f"### `{filepath}`\n\n")
            output_content.append(f"```{extension}\n")
            output_content.append(content)
            output_content.append("\n```\n\n")
        except Exception as e:
            print(f"Error reading file {filepath}: {e}", file=sys.stderr)

    final_output = "".join(output_content)
    os.chdir(initial_dir)

    if not sys.stdout.isatty():
        sys.stdout.write(final_output)
        print("Content streamed to stdout.", file=sys.stderr)
    else:
        try:
            with open(args.output, 'w', encoding='utf-8') as f:
                f.write(final_output)
            print(f"Successfully created '{args.output}' with {len(included_files)} files.", file=sys.stderr)
        except IOError as e:
            print(f"Error writing to file {args.output}: {e}", file=sys.stderr)

if __name__ == "__main__":
    main()