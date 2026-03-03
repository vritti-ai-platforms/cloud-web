#!/bin/bash

# Read stdin to get JSON
input=$(cat)

# Extract tool name and input
tool_name=$(echo "$input" | jq -r '.tool_name')
file_path=$(echo "$input" | jq -r '.tool_input.file_path')

# Only check if a file was written/replaced
if [[ "$tool_name" != "write_file" && "$tool_name" != "replace" ]]; then
  exit 0
fi

# 1. JSDoc check
if [[ "$file_path" == *.ts || "$file_path" == *.tsx ]] && grep -nE '^\s*/\*\*' "$file_path" 2>/dev/null | grep -vE '@deprecated' | head -1 | grep -q '.'; then
  echo "⚠️  WARNING: Use // comments, not /** */ JSDoc style. Only /** @deprecated */ is allowed." >&2
fi

# 2. React import check (from conventions)
if [[ "$file_path" == *.tsx ]] && grep -qE "import \* as React from 'react'" "$file_path" 2>/dev/null; then
  echo "❌ BLOCKED: Always use 'import type React from "react"' — never 'import * as React from "react"'." >&2
  exit 1
fi

exit 0
