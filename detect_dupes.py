
import re

def find_duplicates_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Simple stack-based parser to track nesting and check for duplicates in each scope
    stack = []
    current_keys = set()
    errors = []
    
    # regex for keys: can be key:, "key":, 'key':
    # also need to track { and }
    # and ignore comments
    
    # Remove single-line comments
    content_no_comments = re.sub(r'//.*', '', content)
    # Remove multi-line comments
    content_no_comments = re.sub(r'/\*.*?\*/', '', content_no_comments, flags=re.DOTALL)
    
    tokens = re.findall(r'(\{|\}|[a-zA-Z0-9_]+(?=\s*:)|"[a-zA-Z0-9_]+"(?=\s*:))', content_no_comments)
    
    for token in tokens:
        if token == '{':
            stack.append(current_keys)
            current_keys = set()
        elif token == '}':
            if stack:
                current_keys = stack.pop()
        else:
            key = token.strip('"').strip("'")
            if key in current_keys:
                # Find line number (approximate)
                # For simplicity, just report the duplicate key
                errors.append(key)
            current_keys.add(key)
            
    return errors

duplicates = find_duplicates_in_file('src/i18n/locales.ts')
print("Duplicate keys found per scope:")
print(duplicates)
