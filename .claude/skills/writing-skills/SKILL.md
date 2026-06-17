---
name: writing-skills
description: Use when creating new skills, editing existing skills, or verifying skills work before deployment
---

# Writing Skills

## Overview

**Writing skills IS Test-Driven Development applied to process documentation.**

You write test cases (pressure scenarios with subagents), watch them fail (baseline behavior), write the skill (documentation), watch tests pass (agents comply), and refactor (close loopholes).

**Core principle:** If you didn't watch an agent fail without the skill, you don't know if the skill teaches the right thing.

**REQUIRED BACKGROUND:** You MUST understand `superpowers:test-driven-development` before using this skill. Same principles apply to documentation.

## What is a Skill?

A **skill** is a reference guide for proven techniques, patterns, or tools. Skills help future Claude instances find and apply effective approaches.

**Skills are:** Reusable techniques, patterns, tools, reference guides

**Skills are NOT:** Narratives about how you solved a problem once

## TDD Mapping for Skills

| TDD Concept | Skill Creation |
|-------------|----------------|
| **Test case** | Pressure scenario with subagent |
| **Production code** | Skill document (SKILL.md) |
| **Test fails (RED)** | Agent violates rule without skill (baseline) |
| **Test passes (GREEN)** | Agent complies with skill present |
| **Refactor** | Close loopholes while maintaining compliance |
| **Write test first** | Run baseline scenario BEFORE writing skill |
| **Watch it fail** | Document exact rationalizations agent uses |
| **Minimal code** | Write skill addressing those specific violations |

## When to Create a Skill

**Create when:**
- Technique wasn't intuitively obvious to you
- You'd reference this again across projects
- Pattern applies broadly (not project-specific)
- Others would benefit

**Don't create for:**
- One-off solutions
- Standard practices well-documented elsewhere
- Project-specific conventions (put in CLAUDE.md)

## SKILL.md Structure

**Frontmatter (YAML):**
- Two required fields: `name` and `description`
- Max 1024 characters total
- `name`: Use letters, numbers, and hyphens only
- `description`: Starts with "Use when..." — describes ONLY triggering conditions, never the workflow

```markdown
---
name: Skill-Name-With-Hyphens
description: Use when [specific triggering conditions and symptoms]
---

# Skill Name

## Overview
What is this? Core principle in 1-2 sentences.

## When to Use
Bullet list with symptoms and use cases

## Core Pattern
Before/after code comparison

## Quick Reference
Table or bullets for scanning

## Common Mistakes
What goes wrong + fixes
```

## Claude Search Optimization (CSO)

**CRITICAL: Description = When to Use, NOT What the Skill Does**

The description must ONLY describe triggering conditions. Do NOT summarize the skill's process or workflow.

**Why this matters:** When a description summarizes the skill's workflow, Claude may follow the description instead of reading the full skill content. Descriptions that summarize workflow create a shortcut Claude will take. The skill body becomes documentation Claude skips.

```yaml
# ❌ BAD: Summarizes workflow
description: Use when executing plans - dispatches subagent per task with code review between tasks

# ✅ GOOD: Just triggering conditions
description: Use when executing implementation plans with independent tasks in the current session
```

**Token Efficiency:**
- Frequently-loaded skills: target <200 words total
- Other skills: <500 words
- Move details to separate reference files for long content

## The Iron Law (Same as TDD)

```
NO SKILL WITHOUT A FAILING TEST FIRST
```

Write skill before testing? Delete it. Start over.

## RED-GREEN-REFACTOR for Skills

### RED: Write Failing Test (Baseline)
Run pressure scenario with subagent WITHOUT the skill. Document exact rationalizations.

### GREEN: Write Minimal Skill
Write skill that addresses those specific rationalizations. Verify agents now comply.

### REFACTOR: Close Loopholes
Find new rationalizations → add explicit counters → re-test until bulletproof.

## Bulletproofing Discipline Skills

Skills that enforce discipline need to resist rationalization:

1. **Close loopholes explicitly** — don't just state the rule, forbid specific workarounds
2. **Address "Spirit vs Letter"** — add "Violating the letter is violating the spirit"
3. **Build rationalization table** — capture every excuse agents use
4. **Create red flags list** — make self-checking easy

## Anti-Patterns

- **Narrative examples** — "In session 2025-10-03, we found..." (too specific, not reusable)
- **Multi-language dilution** — 5 language examples instead of 1 excellent one
- **Code in flowcharts** — can't copy-paste
- **Generic labels** — `step1`, `helper2` have no semantic meaning

## Skill Creation Checklist

**RED Phase:**
- [ ] Create pressure scenarios (3+ combined pressures for discipline skills)
- [ ] Run scenarios WITHOUT skill — document baseline behavior verbatim

**GREEN Phase:**
- [ ] Name uses only letters, numbers, hyphens
- [ ] YAML frontmatter with `name` and `description`
- [ ] Description starts with "Use when..." — no workflow summary
- [ ] Addresses specific baseline failures identified in RED
- [ ] Run scenarios WITH skill — verify compliance

**REFACTOR Phase:**
- [ ] Identify new rationalizations from testing
- [ ] Add explicit counters
- [ ] Build rationalization table
- [ ] Re-test until bulletproof

**Do NOT create multiple skills in batch without testing each.**
