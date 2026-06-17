# node-code-sandbox-mcp

A Node.js MCP server that runs JavaScript code inside isolated Docker containers.

## Project Overview

This MCP server provides tools for running JavaScript code in sandboxed Docker environments:

- **sandbox_initialize** — Start a new Docker container sandbox session
- **sandbox_exec** — Execute shell commands in a running sandbox
- **run_js** — Install npm deps and run JavaScript in a sandbox
- **sandbox_stop** — Terminate and remove a sandbox container
- **run_js_ephemeral** — Run a JS snippet in a temporary container (auto-cleanup)
- **get_dependency_types** — Fetch TypeScript definitions for npm packages
- **ai_generate** — Generate text using Google Gemini

## Tech Stack

- **Runtime:** Node.js with TypeScript (ESM)
- **Package Manager:** npm
- **Testing:** Vitest
- **MCP SDK:** `@modelcontextprotocol/sdk`
- **Containerization:** Docker

## Development Commands

```bash
npm run build        # Compile TypeScript
npm run dev          # Watch mode
npm test             # Run tests (Vitest)
npm run lint         # ESLint
npm run format       # Prettier
```

## Key Files

- `src/server.ts` — MCP server entry point, tool registration
- `src/tools/` — Individual tool implementations
- `src/config.ts` — Configuration (container timeouts, etc.)
- `src/dockerUtils.ts` — Docker container management
- `src/containerUtils.ts` — Container lifecycle/scavenger
- `src/runUtils.ts` — Code execution utilities
- `test/` — Vitest test files

## Environment Variables

See `.env.sample` for required environment variables including Docker configuration.

## Superpowers Development Methodology

This project uses the [Superpowers](https://github.com/obra/superpowers) development methodology.

When working on this project, **always check for applicable skills before taking any action**. Skills are located in `.claude/skills/`.

### Available Skills

| Skill | When to Use |
|-------|-------------|
| `using-superpowers` | Starting any conversation — check this first |
| `brainstorming` | Before creating any new feature or making significant changes |
| `test-driven-development` | Before writing any implementation code |
| `systematic-debugging` | When encountering bugs or unexpected behavior |
| `writing-plans` | When you have requirements for a multi-step task |
| `executing-plans` | When executing a written implementation plan |
| `verification-before-completion` | Before claiming work is complete |
| `using-git-worktrees` | When starting feature work needing isolation |
| `dispatching-parallel-agents` | When facing 2+ independent tasks |
| `subagent-driven-development` | When executing plans with independent tasks |
| `finishing-a-development-branch` | When implementation is complete |
| `requesting-code-review` | After completing tasks, before merging |
| `receiving-code-review` | When receiving code review feedback |
| `writing-skills` | When creating or modifying skill documentation |

### Key Principles

1. **Design before implementation** — Use `brainstorming` before writing code
2. **Test-first** — Write failing tests before implementation code
3. **Root cause first** — Use `systematic-debugging` before proposing fixes
4. **Verify before claiming done** — Use `verification-before-completion`
5. **Plan storage:** `docs/superpowers/plans/YYYY-MM-DD-<feature>.md`
6. **Spec storage:** `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
