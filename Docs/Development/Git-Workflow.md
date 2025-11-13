# Git Workflow Guide

**Last Updated**: 2025-11-13

Git workflow and branching strategy for Tulumbak E-Commerce Platform.

## Branch Structure

### Main Branches

- **`main`**: Production-ready code, always stable
- **`develop`**: Integration branch for features (if using Git Flow)

### Supporting Branches

- **`feature/*`**: New features
- **`fix/*`**: Bug fixes
- **`hotfix/*`**: Production hot fixes
- **`refactor/*`**: Code refactoring
- **`docs/*`**: Documentation updates

---

## Workflow

### 1. Start New Feature

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/email-system
```

### 2. Make Changes

```bash
# Work on your feature
# Make commits as you progress

# Add files
git add .

# Commit with descriptive message
git commit -m "feat(email): Add SMTP configuration UI"
```

### 3. Keep Branch Updated

```bash
# Regularly sync with main
git checkout main
git pull origin main

git checkout feature/email-system
git rebase main

# Or merge if preferred
git merge main
```

### 4. Push to Remote

```bash
# Push feature branch
git push origin feature/email-system

# First time pushing
git push -u origin feature/email-system
```

### 5. Create Pull Request

1. Go to GitHub/GitLab
2. Create Pull Request from `feature/email-system` to `main`
3. Add description and screenshots
4. Request review from team members

### 6. After Review and Merge

```bash
# Switch to main
git checkout main

# Pull latest changes
git pull origin main

# Delete local feature branch
git branch -d feature/email-system

# Delete remote feature branch
git push origin --delete feature/email-system
```

---

## Commit Message Convention

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(email): Add template testing` |
| `fix` | Bug fix | `fix(order): Resolve duplicate ID issue` |
| `docs` | Documentation | `docs(api): Update email endpoints` |
| `style` | Code formatting | `style(admin): Format with Prettier` |
| `refactor` | Code refactoring | `refactor(service): Extract email logic` |
| `perf` | Performance improvement | `perf(db): Add order index` |
| `test` | Adding tests | `test(order): Add integration tests` |
| `chore` | Maintenance | `chore(deps): Update dependencies` |

### Scopes

Common scopes:
- `email`: Email system
- `order`: Order management
- `product`: Product features
- `courier`: Courier integration
- `admin`: Admin panel
- `api`: API endpoints
- `db`: Database changes
- `auth`: Authentication

### Examples

**Good Commit Messages:**
```
feat(email): Add logo upload with Cloudinary integration

- Support both URL and file upload options
- Add preview functionality in settings page
- Integrate with Cloudinary for file storage
- Add validation for image formats and size

Closes #123
```

```
fix(order): Prevent duplicate order ID generation

Orders created simultaneously were getting the same ID
due to race condition in ID generator.

Solution:
- Use MongoDB atomic counter
- Add unique index on orderId field
- Add retry logic for duplicate key errors

Fixes #456
```

```
refactor(service): Extract email rendering logic

- Move React Email rendering to EmailRenderer service
- Add proper error handling and logging
- Improve template caching
- Update tests for new structure
```

**Bad Commit Messages:**
```
update files
fixed bug
changes
wip
asdfasdf
```

---

## Branching Strategies

### Feature Branch Workflow (Current)

```
main
├── feature/email-system
├── feature/courier-integration
└── fix/order-validation
```

**Process:**
1. Create feature branch from `main`
2. Develop feature
3. Create PR to `main`
4. Merge after review

### Git Flow (Alternative)

```
main (production)
└── develop (integration)
    ├── feature/email-system
    ├── feature/courier-integration
    └── fix/order-validation
```

**Process:**
1. Feature branches from `develop`
2. PR to `develop`
3. Release branches from `develop`
4. Merge to `main` and tag release

---

## Best Practices

### Commit Frequency

**Do:**
- Commit frequently with logical changes
- One feature/fix per commit
- Commit working code

**Don't:**
- Commit broken code
- Giant commits with multiple features
- Commits like "fix", "update", "changes"

### Branch Management

**Do:**
- Keep branches short-lived (days, not weeks)
- Regularly sync with main/develop
- Delete branches after merge
- Use descriptive branch names

**Don't:**
- Work on main directly
- Keep stale branches
- Use vague branch names like "my-branch"

### Pull Requests

**Do:**
- Write clear PR description
- Reference related issues
- Add screenshots for UI changes
- Keep PRs focused and small
- Respond to review comments

**Don't:**
- Create massive PRs (>500 lines)
- Mix multiple features in one PR
- Ignore review feedback

---

## Common Git Commands

### Daily Workflow

```bash
# Check status
git status

# View changes
git diff

# Stage changes
git add .
git add file1.js file2.js  # Stage specific files

# Commit
git commit -m "feat(email): Add feature"

# Push
git push origin feature/my-feature

# Pull latest changes
git pull origin main
```

### Branch Management

```bash
# List branches
git branch              # Local branches
git branch -r           # Remote branches
git branch -a           # All branches

# Create and switch to branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Delete branch
git branch -d feature/old-feature    # Local
git push origin --delete feature/old-feature  # Remote
```

### Syncing

```bash
# Fetch changes
git fetch origin

# Pull changes (fetch + merge)
git pull origin main

# Rebase on main
git checkout feature/my-feature
git rebase main

# Update all branches
git fetch --all
```

### Stashing

```bash
# Save changes temporarily
git stash

# List stashes
git stash list

# Apply stash
git stash apply

# Apply and remove
git stash pop

# Clear all stashes
git stash clear
```

### Undoing Changes

```bash
# Discard changes in file
git checkout -- file.js

# Unstage file
git reset HEAD file.js

# Amend last commit
git commit --amend -m "New message"

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Viewing History

```bash
# View commit history
git log

# Compact log
git log --oneline

# Graphical log
git log --graph --oneline --all

# View specific file history
git log -- file.js

# View changes in commit
git show <commit-hash>
```

---

## Conflict Resolution

### When Conflicts Occur

```bash
# After pull/merge/rebase conflict
git status  # Shows conflicted files

# Open conflicted files and look for:
<<<<<<< HEAD
Your changes
=======
Incoming changes
>>>>>>> branch-name

# Edit file to resolve
# Remove conflict markers
# Keep desired changes

# Stage resolved files
git add conflicted-file.js

# Continue rebase
git rebase --continue

# Or continue merge
git commit
```

### Conflict Prevention

- Pull frequently
- Keep branches up to date
- Communicate with team
- Small, focused changes
- Regular code reviews

---

## Tagging Releases

### Creating Tags

```bash
# Lightweight tag
git tag v1.0.0

# Annotated tag (recommended)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag specific commit
git tag -a v1.0.0 <commit-hash> -m "Release 1.0.0"

# Push tags
git push origin v1.0.0
git push origin --tags  # Push all tags
```

### Tag Naming Convention

```
v<major>.<minor>.<patch>

Examples:
v1.0.0 - Major release
v1.1.0 - Minor release (new features)
v1.1.1 - Patch release (bug fixes)
```

---

## Git Hooks

### Pre-commit Hook

Automatically run before each commit:

```bash
# .git/hooks/pre-commit
#!/bin/sh

# Run linter
npm run lint

# Run tests
npm test

# If either fails, prevent commit
if [ $? -ne 0 ]; then
  echo "Pre-commit checks failed"
  exit 1
fi
```

### Pre-push Hook

Automatically run before push:

```bash
# .git/hooks/pre-push
#!/bin/sh

# Run full test suite
npm run test:all

if [ $? -ne 0 ]; then
  echo "Tests failed, push aborted"
  exit 1
fi
```

---

## .gitignore Best Practices

**Backend .gitignore:**
```
# Dependencies
node_modules/

# Environment
.env
.env.local
.env.production

# Logs
logs/
*.log

# Build
dist/
build/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Uploads
uploads/*
!uploads/.gitkeep
```

**Admin .gitignore:**
```
# Dependencies
node_modules/

# Build
dist/
build/

# Environment
.env
.env.local
.env.production

# Cache
.vite/
.cache/

# IDE
.vscode/
.idea/
```

---

## Troubleshooting

### Accidentally Committed to Wrong Branch

```bash
# Copy commit hash
git log

# Switch to correct branch
git checkout correct-branch

# Cherry-pick the commit
git cherry-pick <commit-hash>

# Switch back and remove commit
git checkout wrong-branch
git reset --hard HEAD~1
```

### Want to Undo Last Commit

```bash
# Keep changes
git reset --soft HEAD~1

# Discard changes
git reset --hard HEAD~1
```

### Need to Pull but Have Local Changes

```bash
# Option 1: Stash changes
git stash
git pull
git stash pop

# Option 2: Commit changes first
git add .
git commit -m "WIP: temporary commit"
git pull
```

### Pushed Sensitive Data

```bash
# 1. Remove from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Force push
git push origin --force --all

# 3. Rotate credentials immediately
```

---

## Code Review Guidelines

### For Authors

- Keep PRs small (<500 lines)
- Write clear description
- Add tests
- Run linter and tests before PR
- Respond to feedback promptly
- Update PR after changes

### For Reviewers

- Review within 24 hours
- Be constructive and specific
- Ask questions, don't command
- Approve when ready
- Test locally if needed

---

## Quick Reference

```bash
# Start feature
git checkout -b feature/name

# Regular commits
git add .
git commit -m "feat: description"

# Keep updated
git fetch origin
git rebase origin/main

# Push
git push origin feature/name

# After merge
git checkout main
git pull origin main
git branch -d feature/name
```

---

**For coding standards, see**: [Coding Standards](./Coding-Standards.md)
**For getting started, see**: [Getting Started](./Getting-Started.md)
**For deployment, see**: [Deployment Guide](./Deployment.md)
