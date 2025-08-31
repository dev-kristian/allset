#!/usr/bin/env python3

import os
import sys
import subprocess
import argparse
import fnmatch
from collections import Counter
import glob

# --- GUI Imports (Standard Library) ---
import tkinter as tk
from tkinter import ttk, filedialog, messagebox

# --- Configuration ---
DEFAULT_IGNORE_PATTERNS = [
    # Directories
    ".git/", ".next/", ".venv/", "venv/", "__pycache__/", "node_modules/", "build/", "dist/",
    # Files
    ".DS_Store", "*.pyc", "*.pyo", "*.o", "*.so", "*.a", "*.dll", "*.exe", "*.md",
    "*.db", "*.sqlite", "*.sqlite3",
    "*.lock", "poetry.lock", "pnpm-lock.yaml", "package-lock.json", "yarn.lock",
    "*.swp", "*.swo", "*.swn",
    "*.egg-info/", "*.dist-info/",
    # Media and large files
    "*.jpg", "*.jpeg", "*.png", "*.gif", "*.bmp", "*.tiff", "*.ico",
    "*.mp3", "*.wav", "*.flac",
    "*.mp4", "*.avi", "*.mov", "*.mkv",
    "*.zip", "*.tar", "*.gz", "*.rar", "*.7z",
    "*.pdf", "*.doc", "*.docx", "*.xls", "*.xlsx", "*.ppt", "*.pptx",
    "*.iso", "*.img", "*.bin", "*.svg"
]
MAX_FILE_SIZE = 1 * 1024 * 1024  # 1 MB

# --- Helper Functions ---
def is_binary(filepath):
    """Heuristic to check if a file is binary."""
    try:
        with open(filepath, 'rb') as f:
            chunk = f.read(1024)
        if not chunk: return False
        if b'\0' in chunk: return True
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
        all_git_files = subprocess.check_output(['git', 'ls-files'], cwd=repo_path, text=True).strip().split('\n')
        log_output = subprocess.check_output(['git', 'log', '--pretty=format:', '--name-only'], cwd=repo_path, text=True)
        counts.update(log_output.strip().split('\n'))
        for f in all_git_files:
            if f not in counts: counts[f] = 0
    except (subprocess.CalledProcessError, FileNotFoundError):
        return {}
    return counts

def parse_gitignore(root_dir):
    """Parses all .gitignore files and returns a list of patterns."""
    patterns = []
    for dirpath, _, filenames in os.walk(root_dir):
        if '.gitignore' in filenames:
            gitignore_path = os.path.join(dirpath, '.gitignore')
            relative_dir = os.path.relpath(dirpath, root_dir)
            if relative_dir == '.': relative_dir = ''
            with open(gitignore_path, 'r', errors='ignore') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        patterns.append(os.path.join(relative_dir, line).replace(os.sep, '/'))
    return patterns

def find_files_to_include(paths, ignore_patterns, git_root):
    """Walks directories to find files, pruning ignored directories. Used by CLI."""
    all_files = set()
    dir_ignore_patterns = [p for p in ignore_patterns if p.endswith('/')]
    file_ignore_patterns = [p for p in ignore_patterns if not p.endswith('/')]

    for path in paths:
        abs_path = os.path.abspath(path)
        if not os.path.exists(abs_path): continue

        if os.path.isfile(abs_path):
            relative_filepath = os.path.relpath(abs_path, git_root).replace(os.sep, '/')
            if not any(fnmatch.fnmatch(relative_filepath, p) for p in file_ignore_patterns):
                 all_files.add(abs_path)
            continue
        
        if os.path.isdir(abs_path):
            for dirpath, dirnames, filenames in os.walk(abs_path, topdown=True):
                relative_dirpath = os.path.relpath(dirpath, git_root).replace(os.sep, '/') + '/'
                if relative_dirpath == './': relative_dirpath = ''
                
                dirnames[:] = [d for d in dirnames if not any(fnmatch.fnmatch(relative_dirpath + d + '/', pattern) for pattern in dir_ignore_patterns)]
                
                for filename in filenames:
                    filepath = os.path.join(dirpath, filename)
                    relative_filepath = os.path.relpath(filepath, git_root).replace(os.sep, '/')
                    if not any(fnmatch.fnmatch(relative_filepath, pattern) for pattern in file_ignore_patterns):
                        all_files.add(filepath)
    return list(all_files)

# --- Core Logic ---
def generate_markdown_from_paths(paths, output_file, custom_ignore_patterns, max_size, pre_scanned=False):
    """
    The core logic of the script.
    If pre_scanned is True, `paths` is treated as the final list of files.
    If pre_scanned is False, `paths` are directories/files to be scanned.
    """
    git_root = get_git_root()
    initial_dir = os.getcwd()
    os.chdir(git_root)

    change_counts = get_git_change_counts(git_root)

    if pre_scanned:
        # GUI path: The files are already selected and vetted.
        all_found_files = paths
    else:
        # CLI path: Scan the provided paths and apply ignore patterns.
        gitignore_patterns = parse_gitignore(git_root)
        all_ignore_patterns = DEFAULT_IGNORE_PATTERNS + gitignore_patterns + custom_ignore_patterns
        all_found_files = find_files_to_include(paths, all_ignore_patterns, git_root)

    included_files = []
    for filepath in all_found_files:
        relative_path = os.path.relpath(filepath, git_root).replace(os.sep, '/')
        try:
            if os.path.getsize(filepath) > max_size: continue
        except OSError: continue
        if is_binary(filepath): continue
        included_files.append(relative_path)

    included_files.sort(key=lambda f: change_counts.get(f, 0))

    output_content = [
        f"# Repository Snapshot: {os.path.basename(git_root)}\n\n"
        "This file is a merged representation of a subset of the codebase...\n\n"
        f"- **Total Files**: {len(included_files)}\n\n---\n\n"
        "## Directory Structure\n\n```\n"
    ]
    output_content.extend(f"{path}\n" for path in sorted(included_files))
    output_content.append("```\n\n---\n\n## File Contents\n\n")

    for filepath in included_files:
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            extension = os.path.splitext(filepath)[1].lstrip('.')
            output_content.append(f"### `{filepath}`\n\n```{extension}\n{content}\n```\n\n")
        except Exception: pass

    final_output = "".join(output_content)
    os.chdir(initial_dir)

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(final_output)
        return f"Successfully created '{output_file}' with {len(included_files)} files."
    except IOError as e:
        return f"Error writing to file {output_file}: {e}"

# --- Tkinter GUI Application ---
class RepoMixApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("RepoMix GUI")
        self.geometry("900x700")
        self.project_root = get_git_root()

        style = ttk.Style(self)
        style.configure("Treeview", rowheight=25)
        style.configure('.', font=('Helvetica', 10))
        style.configure('TButton', padding=5)
        style.configure('TLabelframe.Label', font=('Helvetica', 11, 'bold'))
        # Configure a tag for graying out unchecked items
        self.tag_unchecked = 'unchecked'
        
        self.STATE_UNCHECKED, self.STATE_CHECKED, self.STATE_TRISTATE = 0, 1, 2
        self.checkbox_chars = ('[ ] ', '[x] ', '[-] ')
        self.icons = {'folder': '📁', 'file': '📄'}
        
        self.item_states = {}
        self.create_widgets()
        self.tree.tag_configure(self.tag_unchecked, foreground='gray70') # Lighter gray
        self.refresh_tree_view()
        self.tree.bind('<Button-1>', self.on_item_click, True)

    def _get_combined_ignore_patterns(self):
        gitignore_patterns = parse_gitignore(self.project_root)
        custom_ignore = self.ignore_text.get("1.0", "end-1c").strip().split('\n')
        return DEFAULT_IGNORE_PATTERNS + gitignore_patterns + [p for p in custom_ignore if p]

    def create_widgets(self):
        header_frame = ttk.Frame(self, padding=(10, 10, 10, 0))
        header_frame.pack(fill=tk.X)
        ttk.Label(header_frame, text="Project Root:", font=('Helvetica', 10, 'bold')).pack(side=tk.LEFT)
        ttk.Label(header_frame, text=self.project_root).pack(side=tk.LEFT, padx=5)

        paned_window = ttk.PanedWindow(self, orient=tk.HORIZONTAL)
        paned_window.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        tree_frame = ttk.Labelframe(paned_window, text="Select Files and Folders", padding=5)
        paned_window.add(tree_frame, weight=2)
        tree_frame.grid_rowconfigure(0, weight=1)
        tree_frame.grid_columnconfigure(0, weight=1)

        self.tree = ttk.Treeview(tree_frame, selectmode='none')
        self.tree.grid(row=0, column=0, sticky="nsew")
        ysb = ttk.Scrollbar(tree_frame, orient='vertical', command=self.tree.yview)
        xsb = ttk.Scrollbar(tree_frame, orient='horizontal', command=self.tree.xview)
        self.tree.configure(yscroll=ysb.set, xscroll=xsb.set)
        ysb.grid(row=0, column=1, sticky='ns')
        xsb.grid(row=1, column=0, sticky='ew')

        options_frame = ttk.Frame(paned_window, padding=5)
        paned_window.add(options_frame, weight=1)
        options_frame.grid_columnconfigure(0, weight=1)
        
        output_frame = ttk.Labelframe(options_frame, text="Output File", padding=10)
        output_frame.grid(row=0, column=0, sticky="ew", pady=(0, 10))
        output_frame.grid_columnconfigure(0, weight=1)
        self.output_path_var = tk.StringVar(value="repomix_output.md")
        output_entry = ttk.Entry(output_frame, textvariable=self.output_path_var)
        output_entry.grid(row=0, column=0, sticky="ew", padx=(0, 5))
        browse_button = ttk.Button(output_frame, text="Browse...", command=self.browse_output_file)
        browse_button.grid(row=0, column=1, sticky="e")

        ignore_frame = ttk.Labelframe(options_frame, text="Ignore Patterns", padding=10)
        ignore_frame.grid(row=1, column=0, sticky="nsew")
        ignore_frame.grid_rowconfigure(0, weight=1)
        ignore_frame.grid_columnconfigure(0, weight=1)
        self.ignore_text = tk.Text(ignore_frame, height=10, width=40, relief=tk.SOLID, borderwidth=1)
        self.ignore_text.grid(row=0, column=0, sticky="nsew")
        self.ignore_text.insert("1.0", "\n".join(DEFAULT_IGNORE_PATTERNS))
        ignore_scroll = ttk.Scrollbar(ignore_frame, orient='vertical', command=self.ignore_text.yview)
        self.ignore_text.configure(yscrollcommand=ignore_scroll.set)
        ignore_scroll.grid(row=0, column=1, sticky='ns')

        control_frame = ttk.Frame(self, padding=(10, 0, 10, 10))
        control_frame.pack(fill=tk.X)
        self.status_var = tk.StringVar(value="Ready.")
        status_label = ttk.Label(control_frame, textvariable=self.status_var, anchor="w")
        status_label.pack(side=tk.LEFT, fill=tk.X, expand=True)
        refresh_button = ttk.Button(control_frame, text="Refresh Tree", command=self.refresh_tree_view)
        refresh_button.pack(side=tk.LEFT, padx=(0, 10))
        generate_button = ttk.Button(control_frame, text="Generate Markdown", command=self.run_generation)
        generate_button.pack(side=tk.RIGHT)

    def refresh_tree_view(self):
        self.tree.delete(*self.tree.get_children())
        self.item_states.clear()
        ignore_patterns = self._get_combined_ignore_patterns()
        self.populate_tree(parent="", path=self.project_root, ignore_patterns=ignore_patterns)

    def populate_tree(self, parent, path, ignore_patterns):
        dir_ignore = [p for p in ignore_patterns if p.endswith('/')]
        file_ignore = [p for p in ignore_patterns if not p.endswith('/')]
        try:
            for item in sorted(os.listdir(path)):
                full_path = os.path.join(path, item)
                rel_path = os.path.relpath(full_path, self.project_root).replace(os.sep, '/')
                
                is_dir = os.path.isdir(full_path)
                if (is_dir and any(fnmatch.fnmatch(rel_path + '/', p) for p in dir_ignore)) or \
                   (not is_dir and any(fnmatch.fnmatch(rel_path, p) for p in file_ignore)):
                    continue
                
                icon = self.icons['folder'] if is_dir else self.icons['file']
                node_text = f"{self.checkbox_chars[self.STATE_CHECKED]}{icon} {item}"
                node = self.tree.insert(parent, 'end', iid=full_path, text=node_text, open=False, values=[item, icon])
                self.item_states[full_path] = self.STATE_CHECKED
                if is_dir: self.populate_tree(node, full_path, ignore_patterns)
        except (IOError, OSError): pass

    def on_item_click(self, event):
        item_id = self.tree.identify_row(event.y)
        if not item_id or self.tree.identify_column(event.x) != '#0': return
        current_state = self.item_states.get(item_id, self.STATE_UNCHECKED)
        new_state = self.STATE_UNCHECKED if current_state != self.STATE_UNCHECKED else self.STATE_CHECKED
        self._change_item_state(item_id, new_state)
        self._propagate_down(item_id, new_state)
        self._propagate_up(item_id)

    def _change_item_state(self, item_id, state):
        self.item_states[item_id] = state
        original_name, icon = self.tree.item(item_id, 'values')
        self.tree.item(item_id, text=f"{self.checkbox_chars[state]}{icon} {original_name}")
        # Apply or remove the visual tag for being unchecked
        if state == self.STATE_UNCHECKED:
            self.tree.item(item_id, tags=(self.tag_unchecked,))
        else:
            self.tree.item(item_id, tags=())

    def _propagate_down(self, item_id, state):
        if state == self.STATE_TRISTATE: return
        for child_id in self.tree.get_children(item_id):
            self._change_item_state(child_id, state)
            self._propagate_down(child_id, state)

    def _propagate_up(self, item_id):
        parent_id = self.tree.parent(item_id)
        if not parent_id: return
        children_ids = self.tree.get_children(parent_id)
        if not children_ids: return
        child_states = {self.item_states.get(cid) for cid in children_ids}
        new_parent_state = self.STATE_TRISTATE if len(child_states) > 1 else child_states.pop()
        if self.item_states.get(parent_id) != new_parent_state:
            self._change_item_state(parent_id, new_parent_state)
            self._propagate_up(parent_id)

    def browse_output_file(self):
        filename = filedialog.asksaveasfilename(
            title="Save Output As", initialfile="repomix_output.md",
            defaultextension=".md", filetypes=[("Markdown files", "*.md"), ("All files", "*.*")]
        )
        if filename: self.output_path_var.set(filename)

    def run_generation(self):
        # **BUG FIX**: Compile a definitive list of ONLY files that are checked.
        final_file_list = []
        for path, state in self.item_states.items():
            if state == self.STATE_CHECKED and os.path.isfile(path):
                final_file_list.append(path)

        if not final_file_list:
            messagebox.showwarning("No Files Selected", "Please select at least one file to include.")
            return

        output_file = self.output_path_var.get()
        if not output_file:
            messagebox.showwarning("No Output File", "Please specify an output file name.")
            return

        self.status_var.set("Processing... this may take a moment.")
        self.update_idletasks()

        try:
            # Call the core logic with the exact file list and the pre_scanned flag
            status = generate_markdown_from_paths(
                paths=final_file_list, output_file=output_file,
                custom_ignore_patterns=[], max_size=MAX_FILE_SIZE,
                pre_scanned=True
            )
            self.status_var.set(status)
            messagebox.showinfo("Success", status)
        except Exception as e:
            error_msg = f"An unexpected error occurred: {e}"
            self.status_var.set(error_msg)
            messagebox.showerror("Error", error_msg)

# --- Main Execution Logic ---
def main_cli():
    """The original command-line interface function."""
    parser = argparse.ArgumentParser(
        description="Packs a repository's source code into a single Markdown file for LLM consumption.",
        epilog="Example: python repomix_gui.py . -o context.md -i 'tests/'"
    )
    parser.add_argument("paths", nargs='+', help="Paths to process (files, dirs, globs).")
    parser.add_argument("-o", "--output", default="repomix.md", help="Output file name.")
    parser.add_argument("-i", "--ignore", action="append", default=[], help="Add ignore glob pattern.")
    parser.add_argument("--max-size", type=int, default=MAX_FILE_SIZE, help=f"Max file size (bytes).")
    args = parser.parse_args()

    status = generate_markdown_from_paths(
        paths=args.paths, output_file=args.output,
        custom_ignore_patterns=args.ignore, max_size=args.max_size,
        pre_scanned=False # CLI always scans
    )
    print(status, file=sys.stderr)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        main_cli()
    else:
        app = RepoMixApp()
        app.mainloop()