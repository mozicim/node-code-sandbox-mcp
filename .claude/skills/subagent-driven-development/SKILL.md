---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session
---

# Subagent-Driven Development

Execute plan by dispatching fresh subagent per task, with two-stage review after each: spec compliance review first, then code quality review.

**Why subagents:** You delegate tasks to specialized agents with isolated context. By precisely crafting their instructions and context, you ensure they stay focused and succeed at their task. They should never inherit your session's context or history — you construct exactly what they need. This also preserves your own context for coordination work.

**Core principle:** Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration

**Continuous execution:** Do not pause to check in with your human partner between tasks. Execute all tasks from the plan without stopping. The only reasons to stop are: BLOCKED status you cannot resolve, ambiguity that genuinely prevents progress, or all tasks complete. "Should I continue?" prompts and progress summaries waste their time — they asked you to execute the plan, so execute it.

## When to Use

**vs. Executing Plans (parallel session):**
- Same session (no context switch)
- Fresh subagent per task (no context pollution)
- Two-stage review after each task: spec compliance first, then code quality
- Faster iteration (no human-in-loop between tasks)

## The Process

### Per Task:

1. **Dispatch implementer subagent** with full task text + context
2. **If implementer asks questions:** Answer completely before they proceed
3. **Implementer completes:** implements, tests, commits, self-reviews
4. **Dispatch spec reviewer subagent:** confirms code matches spec
5. **If spec issues:** implementer fixes, re-review until spec compliant
6. **Dispatch code quality reviewer subagent**
7. **If quality issues:** implementer fixes, re-review until approved
8. **Mark task complete in TodoWrite**

### After All Tasks:

1. Dispatch final code reviewer subagent for entire implementation
2. Use `superpowers:finishing-a-development-branch`

## Setup

```
Read plan, extract ALL tasks with full text, note context, create TodoWrite
```

Extract all tasks upfront — don't re-read plan file for each task. Controller curates exactly what context each subagent needs.

## Model Selection

Use the least powerful model that can handle each role to conserve cost and increase speed.

**Mechanical implementation tasks** (isolated functions, clear specs, 1-2 files): use a fast, cheap model.

**Integration and judgment tasks** (multi-file coordination, pattern matching, debugging): use a standard model.

**Architecture, design, and review tasks**: use the most capable available model.

## Handling Implementer Status

| Status | Action |
|--------|--------|
| DONE | Proceed to spec compliance review |
| DONE_WITH_CONCERNS | Read concerns, address correctness issues, then review |
| NEEDS_CONTEXT | Provide missing context, re-dispatch |
| BLOCKED | Assess blocker: provide context, upgrade model, break task, or escalate |

**Never** ignore an escalation or force the same model to retry without changes.

## Example Workflow

```
You: I'm using Subagent-Driven Development to execute this plan.

[Read plan file once]
[Extract all 5 tasks with full text and context]
[Create TodoWrite with all tasks]

Task 1: Hook installation script

[Dispatch implementation subagent with full task text + context]

Implementer: "Before I begin - should the hook be installed at user or system level?"

You: "User level (~/.config/superpowers/hooks/)"

Implementer: [Implements, tests, commits, self-reviews]
Status: DONE

[Dispatch spec compliance reviewer]
Spec reviewer: ✅ Spec compliant - all requirements met

[Get git SHAs, dispatch code quality reviewer]
Code reviewer: ✅ Approved

[Mark Task 1 complete]

Task 2: Recovery modes

[Dispatch implementation subagent]
Implementer: [Implements]
Status: DONE

[Dispatch spec compliance reviewer]
Spec reviewer: ❌ Issues:
  - Missing: Progress reporting (spec says "report every 100 items")
  - Extra: Added --json flag (not requested)

[Implementer fixes issues]
[Spec reviewer reviews again: ✅]

[Dispatch code quality reviewer]
Code reviewer: Issues (Important): Magic number (100)

[Implementer fixes]
[Code reviewer reviews again: ✅]

[Mark Task 2 complete]
...
```

## Red Flags

**Never:**
- Start implementation on main/master branch without explicit user consent
- Skip reviews (spec compliance OR code quality)
- Proceed with unfixed issues
- Dispatch multiple implementation subagents in parallel (conflicts)
- Make subagent read plan file (provide full text instead)
- Accept "close enough" on spec compliance
- **Start code quality review before spec compliance is ✅** (wrong order)

## Integration

**Required workflow skills:**
- **superpowers:using-git-worktrees** — Ensures isolated workspace
- **superpowers:writing-plans** — Creates the plan this skill executes
- **superpowers:requesting-code-review** — Code review template for reviewer subagents
- **superpowers:finishing-a-development-branch** — Complete development after all tasks

**Subagents should use:**
- **superpowers:test-driven-development** — For each implementation task
