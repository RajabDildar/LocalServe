Run the end-of-phase completion checklist for: $ARGUMENTS

1. Run tsc --noEmit on both client and server — fix all type errors
2. Check that all new files follow the naming conventions in CLAUDE.md
3. Verify all new API routes return the standard ApiResponse format
4. Check that no secrets or .env values are hardcoded anywhere
5. Run git status and show me all changed files
6. Create a git commit with message using /git-commit-formatter skill (skip if code is already commited)
7. Update the ## Current Phase line in CLAUDE.md to the next phase

Report any issues found.
