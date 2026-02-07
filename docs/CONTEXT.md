# Global Rules

- Language: Python 3.12+
- Architecture: Headless State-Machine (State must be externalized in JSON).
- Constraint: Zero hard-coded game logic in the /engine folder.
- Requirement: Use Pydantic for state validation and Rich for CLI output.

## System Protocol
- BEFORE ANY EXECUTION: Read /PROJECT_MANIFEST.md to verify technical constraints.
- DURING EXECUTION: Cross-reference /docs/BACKLOG.md to ensure task order.
- AFTER EXECUTION: 
    1. Update /docs/CHANGELOG.md (Keep a Changelog format).
    2. Update /docs/JOURNAL.md with architectural memos/lessons.
    3. Verify the state change against /engine/state.py validation rules.
    4. Only then, mark task as COMPLETED in /docs/BACKLOG.md.

## Pre-Flight Protocol
Before writing code, the model MUST:
1. Check BACKLOG.md for the active task ID.
2. Load the corresponding .md file in /docs/specs/.
3. Verify the architecture rules in /PROJECT_MANIFEST.md.

## Windows Compatibility Rules
- **Terminal:** Always use `colorama.init()` or `Rich` console to ensure ANSI colors work in CMD/PowerShell.
- **Encoding:** All `open()` calls must specify `encoding='utf-8'` to prevent Windows-1252 errors.
- **Paths:** Use `pathlib.Path` objects; never concatenate paths using `+ "/"` or `+ "\\"`.