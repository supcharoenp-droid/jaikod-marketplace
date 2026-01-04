
import re

def find_duplicates(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    stack = []
    current_obj = {}
    duplicates = []

    for i, line in enumerate(lines):
        line_num = i + 1
        # Match keys like 'key:' or '"key":' or 'key :'
        match = re.search(r'^\s*([a-zA-Z0-9_]+)\s*:', line)
        if match:
            key = match.group(1)
            # Find the current depth/context
            # This is complex because JS objects can span lines.
            # But usually, it's about the same indentation or block.
            pass

    # Alternative: check for exact duplicate lines within what looks like an object block
    # Actually, ripgrep with line numbers should show if the same line appears twice.

find_duplicates('src/i18n/locales.ts')
