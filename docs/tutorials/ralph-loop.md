# Claude Code + Ralph Loop: Setup Tutorial

A comprehensive guide to using Claude Code with the Ralph Loop technique for autonomous AI-powered development, research, and design workflows.

## Table of Contents
- [What is Claude Code?](#what-is-claude-code)
- [What is Ralph Loop?](#what-is-ralph-loop)
- [Installation](#installation)
- [Setting Up Ralph Loop](#setting-up-ralph-loop)
- [Creating Effective PRDs](#creating-effective-prds)
- [Running Ralph](#running-ralph)
- [Best Practices](#best-practices)
- [Use Cases](#use-cases)

---

## What is Claude Code?

Claude Code is an agentic AI coding assistant that runs in your terminal. Unlike traditional autocomplete tools, Claude Code can:

- Understand your entire codebase
- Execute complex tasks autonomously
- Run tests and modify code
- Handle git workflows through natural language
- Work with multiple files simultaneously

**Key Features:**
- Works directly in your terminal
- Integrates with your existing development workflow
- Supports multiple programming languages and frameworks
- Can read, write, and execute code

---

## What is Ralph Loop?

Ralph Loop (named after Ralph Wiggum from The Simpsons) is an autonomous development technique that keeps Claude Code working on tasks until they're genuinely complete.

**How it works:**
1. You give Claude Code a task
2. Claude works on it and attempts to exit
3. A Stop hook intercepts the exit
4. The same prompt is fed back with fresh context
5. Claude continues iterating until completion criteria are met

**Key Benefits:**
- **Fresh Context**: Each iteration starts clean, avoiding context rot
- **Persistent Progress**: Git history and progress files maintain continuity
- **Autonomous Operation**: Can run for hours while you're away
- **Deterministic Improvement**: Failures become learning opportunities

---

## Installation

### Installing Claude Code

**Recommended: Native Binary (No Node.js required)**

**macOS/Linux:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://claude.ai/install.ps1 | iex
```

**Alternative: npm (requires Node.js 18+)**
```bash
npm install -g @anthropic-ai/claude-code
```

**Verify Installation:**
```bash
claude --version
claude doctor  # Diagnose any issues
```

### Authentication

After installation, authenticate Claude Code:

```bash
claude config
```

You'll need either:
- **Claude Pro/Max subscription** (recommended for regular use)
- **Anthropic API key** from the Console (pay-per-use)

**Set API key via environment variable:**
```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

Add to your shell profile (`.bashrc`, `.zshrc`, etc.) to persist.

---

## Setting Up Ralph Loop

### Option 1: Using the Official Ralph Wiggum Plugin

The official Claude Code plugin provides the simplest setup:

```bash
# Inside your project directory
/ralph-loop:ralph-loop "Your task description here" --max-iterations 50
```

**Plugin Features:**
- Built-in safety controls
- Rate limiting
- Intelligent exit detection
- Configurable iteration limits

### Option 2: Manual Setup with Bash Script

For more control, create a custom Ralph loop:

**1. Create Project Structure:**
```bash
mkdir -p scripts/ralph
cd scripts/ralph
```

**2. Create `ralph.sh`:**
```bash
#!/bin/bash
set -e

MAX_ITERATIONS=${1:-10}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRD_FILE="$SCRIPT_DIR/prd.json"
PROGRESS_FILE="$SCRIPT_DIR/progress.txt"

# Initialize progress file if it doesn't exist
if [ ! -f "$PROGRESS_FILE" ]; then
    echo "=== Ralph Loop Progress ===" > "$PROGRESS_FILE"
    echo "Started: $(date)" >> "$PROGRESS_FILE"
fi

# Main loop
for i in $(seq 1 $MAX_ITERATIONS); do
    echo "Iteration $i/$MAX_ITERATIONS"
    
    # Run Claude Code with the prompt
    OUTPUT=$(claude -p "$(cat prompt.md)" 2>&1) || true
    
    # Check for completion signal
    if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
        echo "Ralph complete!"
        exit 0
    fi
    
    # Add delay to avoid rate limits
    sleep 5
done

echo "Max iterations reached"
```

**3. Make executable:**
```bash
chmod +x ralph.sh
```

### Option 3: Using Third-Party Ralph Implementations

Several enhanced Ralph implementations exist:

**frankbria/ralph-claude-code** (Feature-rich):
```bash
# Install
npm install -g ralph-claude-code

# Run with monitoring
ralph --monitor --timeout 30
```

**Features:**
- Live monitoring dashboard
- Circuit breaker for error detection
- Session continuity
- Configurable timeouts

---

## Creating Effective PRDs

A Product Requirements Document (PRD) defines what "done" looks like. Ralph uses this to determine when to stop.

### PRD Structure (JSON Format)

Create `prd.json`:

```json
{
  "projectName": "My Project",
  "branchName": "ralph/feature-name",
  "userStories": [
    {
      "id": "001",
      "category": "Authentication",
      "priority": 1,
      "title": "User Login",
      "description": "Implement user login with JWT tokens",
      "acceptanceCriteria": [
        "POST /api/login endpoint accepts email and password",
        "Returns JWT token on success",
        "Returns 401 on invalid credentials",
        "Tests pass with >80% coverage"
      ],
      "passes": false
    },
    {
      "id": "002",
      "category": "Database",
      "priority": 2,
      "title": "User Model",
      "description": "Create User model with Sequelize",
      "acceptanceCriteria": [
        "User model has email, password_hash, created_at fields",
        "Email validation implemented",
        "Password hashing uses bcrypt",
        "Migrations created and tested"
      ],
      "passes": false
    }
  ]
}
```

### PRD Structure (Markdown Format)

Create `PRD.md`:

```markdown
# Project: E-commerce Platform

## Feature: Shopping Cart

### Task 1: Add to Cart [Priority: High]
- [ ] POST /api/cart endpoint accepts product_id and quantity
- [ ] Updates cart in database
- [ ] Returns updated cart object
- [ ] Tests passing

### Task 2: Remove from Cart [Priority: High]
- [ ] DELETE /api/cart/:item_id endpoint
- [ ] Removes item from database
- [ ] Returns updated cart
- [ ] Tests passing

### Task 3: Cart Persistence [Priority: Medium]
- [ ] Cart saved to user session
- [ ] Cart restored on login
- [ ] Tests covering edge cases

## Completion Signal
Output `<promise>COMPLETE</promise>` when all tasks are checked off.
```

### Generate PRD Using Claude

Use Claude's plan mode to create a PRD:

```bash
# Start Claude Code
claude

# In Claude, press Shift+Tab for plan mode
# Then prompt:
"Create a detailed PRD for [your feature]. Include:
- User stories with clear acceptance criteria
- Priority levels
- Verification steps
Save to prd.json when ready."
```

---

## Running Ralph

### Human-in-the-Loop (HITL) Mode

**Recommended for learning and complex tasks.**

Create `ralph-once.sh`:
```bash
#!/bin/bash
claude -p "$(cat prompt.md)"
```

**Run manually:**
```bash
./ralph-once.sh
# Review changes
git diff
# Run again
./ralph-once.sh
```

### Autonomous (AFK) Mode

**For tasks you're confident about.**

Create `ralph-auto.sh`:
```bash
#!/bin/bash
MAX_ITERATIONS=50

for i in $(seq 1 $MAX_ITERATIONS); do
    echo "=== Iteration $i ==="
    
    OUTPUT=$(claude -p "Read prd.json. Pick highest priority task where passes: false. \
    Work ONLY on that task. Update prd.json when complete. \
    Commit your work. If all tasks complete, output <promise>COMPLETE</promise>.")
    
    if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
        echo "✓ All tasks complete!"
        exit 0
    fi
    
    sleep 10  # Rate limiting
done
```

### Using the Ralph Plugin

```bash
# Basic usage
/ralph-loop:ralph-loop "Implement user authentication with tests" --max-iterations 30

# With explicit completion criteria
/ralph-loop:ralph-loop "Build REST API. Output <promise>API_COMPLETE</promise> when:
- All CRUD endpoints working
- Input validation in place  
- Tests passing (coverage >80%)
- README with API docs" --max-iterations 50
```

---

## Best Practices

### 1. Define Clear Stop Conditions

**Good:**
```
Build todo API. When complete:
- All CRUD endpoints working
- Tests passing (coverage >80%)
- README with examples
- Output: <promise>COMPLETE</promise>
```

**Bad:**
```
Build a todo API and make it good
```

### 2. Keep PRD Items Small

Each task should fit within one iteration (~15 minutes):

**Good:** "Add email validation to User model"  
**Bad:** "Build complete authentication system"

### 3. Maintain Tight Feedback Loops

**In your prompt:**
```markdown
CRITICAL: After EVERY change:
1. Run type checker
2. Run all tests
3. Run linter
4. Only commit if ALL pass

Do NOT commit broken code.
```

### 4. Use Progress Files

Create `progress.txt` to maintain context between iterations:

```bash
echo "=== Ralph Progress ===" > progress.txt
echo "Project: E-commerce Platform" >> progress.txt
```

**In your prompt:**
```markdown
After completing each task:
1. Commit your changes
2. Append summary to progress.txt with:
   - What you accomplished
   - Any blockers or issues
   - Next recommended task
```

### 5. Monitor Costs

**For API users:**
- Start with ~$20 in credits to test workflows
- Monitor usage per iteration
- Set `--max-iterations` conservatively

**For subscription users (recommended):**
- Claude Max provides better value for frequent use
- Fixed monthly cost vs. pay-per-use

### 6. Start with HITL, Graduate to AFK

1. **Week 1**: Run manually, review each iteration
2. **Week 2**: Let it run 3-5 iterations, then review
3. **Week 3+**: Full AFK for well-defined tasks

---

## Use Cases

### Development

**Feature Implementation:**
```bash
/ralph-loop:ralph-loop "Implement user profile page with:
- Profile photo upload
- Bio editing
- Account settings
- Responsive design
- Tests for all features" --max-iterations 40
```

**Refactoring:**
```bash
/ralph-loop:ralph-loop "Migrate all tests from Jest to Vitest. 
Maintain 100% test coverage. Output <promise>MIGRATION_COMPLETE</promise>" \
--max-iterations 50
```

**Bug Fixing:**
```bash
/ralph-loop:ralph-loop "Fix authentication bug:
Users can't log in with special characters in passwords.
Debug, fix, add regression tests." --max-iterations 20
```

### Research

**Literature Review:**
```bash
/ralph-loop:ralph-loop "Research state-of-the-art approaches to:
- Neural architecture search
- Create markdown summary
- Include citations
- Identify research gaps" --max-iterations 15
```

**Data Analysis:**
```bash
/ralph-loop:ralph-loop "Analyze sales_data.csv:
- Generate statistical summary
- Create visualizations
- Identify trends
- Write findings report" --max-iterations 25
```

### Design

**Component Library:**
```bash
/ralph-loop:ralph-loop "Create React component library:
- Button (primary, secondary, disabled states)
- Input (text, email, password)
- Card component
- Storybook stories for each
- Full accessibility" --max-iterations 35
```

**Design System Documentation:**
```bash
/ralph-loop:ralph-loop "Document our design system:
- Color palette with usage
- Typography scale
- Spacing system
- Component examples
- Figma export" --max-iterations 20
```

---

## Troubleshooting

### Ralph Exits Too Early

**Solution:** Be more explicit about completion criteria:
```
Output <promise>DONE</promise> ONLY when:
1. All tests pass
2. No linting errors
3. README updated
4. You've verified the feature works
```

### Context Rot / Quality Degradation

**Solution:** Reduce iteration scope. Each iteration should be <15 min:
- Break large tasks into smaller PRD items
- Use `--timeout 15` to force shorter iterations

### Loop Gets Stuck

**Solution:** Add circuit breaker logic or use enhanced Ralph implementations:
```bash
# Using frankbria/ralph-claude-code
ralph --monitor --timeout 20  # Auto-detects stuck loops
```

### Permission Issues (npm)

**Solution:** Never use `sudo`. Configure user-level npm:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## Advanced Configuration

### Custom Prompt Template

Create `prompt.md`:
```markdown
You are working on {{PROJECT_NAME}}.

## Current Task
Read prd.json and select the highest priority task where `passes: false`.

## Instructions
1. Analyze the current codebase
2. Implement ONLY the selected task
3. Run all tests and type checks
4. Commit with descriptive message
5. Update prd.json: set `passes: true` for completed task
6. Append summary to progress.txt

## Completion
If ALL tasks in prd.json have `passes: true`, output:
<promise>COMPLETE</promise>

## Quality Standards
- All tests must pass
- Type checker must pass
- Code must be linted
- Never commit broken code

## Context Files
- PRD: prd.json
- Progress: progress.txt
- Git history: Previous iterations' work
```

### Session Continuity

Some Ralph implementations support session memory:

```bash
# Enable session continuity (frankbria implementation)
ralph --monitor  # Sessions enabled by default

# Disable for fresh context each iteration
ralph --no-continue

# Reset session manually
ralph --reset-session
```

---

## Resources

- **Official Docs:** https://code.claude.com/docs
- **Ralph Technique Origin:** Geoffrey Huntley's blog
- **Community Examples:** https://github.com/anthropics/claude-code
- **PRD Templates:** Various GitHub repos (see frankbria, snarktank)

---

## Quick Reference

```bash
# Install Claude Code
curl -fsSL https://claude.ai/install.sh | bash

# Start Claude Code
claude

# Check installation
claude doctor

# Run Ralph (plugin)
/ralph-loop:ralph-loop "Your task" --max-iterations 30

# Run Ralph (custom script)
./ralph.sh 50  # 50 iterations max

# Create PRD with AI
claude  # Then shift+tab for plan mode

# Monitor logs (if using monitoring)
tail -f ~/.ralph/logs/latest.log
```

---

## Summary

**Claude Code + Ralph Loop** enables autonomous AI development that can run for hours while maintaining quality and context. The key is:

1. ✅ **Clear stop conditions** - Define what "done" means
2. ✅ **Small, testable tasks** - Keep iterations under 15 minutes  
3. ✅ **Tight feedback loops** - Test and lint on every commit
4. ✅ **Progressive autonomy** - Start HITL, graduate to AFK
5. ✅ **Structured PRDs** - Use JSON or markdown with clear criteria

Start with human-in-the-loop Ralph, observe patterns, then let it run autonomously for well-defined tasks. The combination of Claude's reasoning with Ralph's persistence creates a powerful development accelerator.

---

**Ready to start?** Install Claude Code, create a simple PRD, and run your first Ralph loop!