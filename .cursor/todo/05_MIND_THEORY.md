# 🎯 Implementation Plan for Agent

## CRITICAL FOUNDATIONS

### Notation System (ALWAYS USE)
- **#term** for ALL definitions and concepts throughout ALL documentation
- **==** for synonyms/equivalents  
- **->** for relationships (loads from, creates, updates, etc.)
- Backticks (`) ONLY for code, commands, file paths, technical references
- **NEVER** use backticks for concepts or definitions

Example:
```markdown
#context == #mental-space where communication happens
#conscious-context -> loads from #unconscious-context via #tools
```

---

## FILE SYSTEM RULES

### File Extensions
- **.mdc** for ALL worker files (human developer + AI agent) in `.cursor/`
- **.md** ONLY for GitHubers (external visitors) in root and as folder README.md descriptions
- **.ts** for all scripts (future-proof for MCP transition)

### Folder Structure

```
./                              # Root - external face
├── README.md                   # For GitHubers (describes project)
├── CONTRIBUTIONS.md            # For GitHubers→Forkers (how to customize)
└── (other project files)

./.cursor/                      # Workers' brain (unconscious context)
├── package.json               # Node scripts: index:rules, index:decisions, etc.
│
├── rules/                     # Core instructions (always loaded)
│   ├── README.md             # (optional) For GitHubers viewing on GitHub
│   ├── dict.mdc              # Master: Mind Theory + Dictionary
│   ├── tasks.mdc             # Rules about tasks (references procedures)
│   ├── decisions.mdc         # Rules about decisions/ADRs (references .cursor/decisions/)
│   ├── procedures.mdc        # Rules about procedures (when to use which)
│   ├── forking.mdc           # Checklist for forkers
│   ├── mcp-future.mdc        # MCP server vision (TypeScript-based)
│   └── (other rule files)
│
├── decisions/                 # Architecture Decision Records
│   ├── README.md             # (optional) For GitHubers
│   ├── INDEX.yaml            # Structured list of decisions (generated)
│   ├── adr-001.mdc           # Individual ADR
│   ├── adr-002.mdc
│   └── script.index.ts       # Script to generate INDEX.yaml
│
├── procedures/                # Step-by-step processes
│   ├── README.md             # (optional) For GitHubers
│   ├── INDEX.yaml            # Structured list (generated)
│   ├── task-defining.mdc     # How to define tasks
│   ├── task-achieving.mdc    # How to complete tasks
│   └── script.index.ts       # Script to generate INDEX.yaml
│
├── tasks/                     # Work items (no subfolders for status)
│   ├── README.md             # (optional) For GitHubers
│   ├── INDEX.yaml            # Generated task list
│   ├── task-001.mdc
│   ├── task-002.mdc
│   ├── backlog/              # (optional) if you want separation
│   ├── completed/            # (optional) if you want separation
│   └── script.index.ts       # Generate INDEX.yaml from headers
│
├── runbooks/                  # Task execution logs (agent-generated summaries)
│   ├── README.md             # (optional) For GitHubers
│   ├── task-001.mdc          # Runbook for task-001
│   └── task-002.mdc
│
├── lessons/                   # Extracted reusable learnings
│   ├── README.md             # (optional) For GitHubers
│   ├── INDEX.yaml            # Generated lessons list
│   ├── context-overload.mdc
│   ├── progressive-disclosure.mdc
│   └── script.index.ts
│
├── content/                   # Reusable content snippets
│   ├── README.md             # (optional) For GitHubers
│   └── tooltips.mdc
│
├── types/                     # TypeScript type definitions
│   ├── types.ts              # Shared types
│   ├── adrs.types.ts         # Types for ADRs
│   └── tasks.types.ts        # Types for tasks
│
└── scripts/                   # Utility scripts (if not in respective folders)
    └── (general scripts)
```

**Note on Sessions**: Spectory already saves sessions to `.spectory/history/YYYY-MM-DD_HH-MMZ-description.md`. Consider symlinking or referencing these in tasks/runbooks rather than duplicating.

---

## SHORTCODE SYNTAX

Format: `[relation:type:identifier]` or `[type:identifier]` when relation is implied

### Examples:
- `[task:001]` - reference to task
- `[adr:003]` - reference to decision
- `[lesson:context-overload]` - reference to lesson
- `[procedure:task-achieving]` - reference to procedure
- `used_in:[task:005, content:tooltips]` - used in multiple places
- `depends_on:[adr:001, task:003]` - dependencies

---

## TASK METADATA (MDC Header)

```yaml
---
name: string              # Required - descriptive task name
number: integer           # Required - unique ID (can be auto-generated)
status: enum              # Required - [idea|backlog|task|wip|done|deferred]
type: enum                # [feature|bugfix|refactor|chore|docs|test|style|perf]
scope: enum               # [docs|design|deploy|build|content|code]
priority: enum            # [low|medium|high|critical]
effort: enum              # [xs|sm|md|lg|xl]
created: date             # YYYY-MM-DD (ISO format)
modified: date            # YYYY-MM-DD (ISO format)
dependencies: array       # Using shortcode: [type:id, type:id]
related_tasks: array      # [task:NNN, task:MMM]
context_files: array      # Files needed in conscious context [path/to/file.mdc]
tags: array               # [tag1, tag2, tag3]
resolution: string        # For done/deferred: [accepted|rejected|deferred|completed]
---
```

---

## RUNBOOK STRUCTURE

File: `.cursor/runbooks/task-NNN.mdc`

Agent generates this when summarizing work on a task.

```markdown
---
task: [task:NNN]
created: YYYY-MM-DD
---

# Runbook: Task NNN - [Task Name]

## Objective
- Original #developer-message / goal
- Why this task exists

## Context Loaded  
- What was retrieved from #unconscious-context
- Files referenced: [file paths]
- Rules applied: [rule:name]
- Lessons consulted: [lesson:name]

## Thought Process
- Reasoning steps
- Alternatives considered
- Why chosen approach was selected

## Actions Taken
- Specific steps executed
- Commands run
- Files modified
- Code changes

## Decisions & Rationale
- Key choices made
- Trade-offs considered
- Why certain paths were chosen

## Outcome
- Success or failure
- What worked well
- What didn't work
- Metrics/results

## Lessons Learned
- Mistakes to avoid
- Patterns that worked
- Improvements for future
- **IF REUSABLE:** Extract to [lesson:name] in `.cursor/lessons/`

## Related
- [lesson:XXX] - if lesson extracted
- [task:YYY] - related tasks
- [adr:ZZZ] - relevant decisions
```

---

## MIND THEORY CORE CONCEPTS

### Mental Architecture (3 Layers)

```
┌──────────────────────────────────────────────────┐
│  #conscious-context (Shallowest)                 │
│  - Active processing window (limited capacity)   │
│  - Cap at ~70% to prevent overload               │
│  - Contains: loaded rules + retrieved context +  │
│    current user message                          │
└──────────────────────────────────────────────────┘
                      ↑
                 loads via #tools
                      ↓
┌──────────────────────────────────────────────────┐
│  #unconscious-context (Medium Depth)             │
│  - Stored information (not actively processed)   │
│  - Repository files, .cursor/ directory          │
│  - External docs, online resources               │
│  - Retrieved via #progressive-disclosure         │
└──────────────────────────────────────────────────┘
                      ↓
                 informed by
                      ↓
┌──────────────────────────────────────────────────┐
│  #foundational-knowledge (Deepest)               │
│  - Agent: Pre-training, language patterns        │
│  - Developer: Expertise, experience              │
│  - Always available, shapes all processing       │
└──────────────────────────────────────────────────┘
```

### Critical Mind Theory Principle

**Agent does NOT have #omniscience** (all-knowing like God). Agent must:
- Be **humble** - assume you don't know everything
- **Verify yourself** - check your actions and reasoning
- Remember: You may not have retrieved all relevant context from #unconscious-context
- Use #progressive-disclosure - load what's needed incrementally
- **Always assume** something important might still be in #unconscious-context

This humility and self-checking must be present in agent's thinking.

### Context Types

**#total-context** == Everything that exists (all layers combined)
- #conscious-context (active)
- #unconscious-context (stored)  
- #foundational-knowledge (deep)
- External sources (docs, web, MCP tools)

**Only God has true omniscience. Agent works with partial context.**

### Information Flow

**#message** == Single communication unit
- #developer-message == User's input to agent
- #system-prompt == Persistent instructions loaded from `.cursor/rules/`

**#instructions** == Complete set of directives for agent
- Components:
  1. #system-prompt (from `.cursor/rules/`)
  2. #developer-message (current user input)
  3. #retrieved-context (from `.cursor/`, repo, docs, MCP tools)
  
**#instructions -> loaded into #conscious-context for processing**

**Distinction is critical**: Don't confuse #message with #instructions. Instructions are the complete compiled context.

---

## ROLES & ENTITIES

- #developer == Human user (including forkers)
- #agent == AI assistant  
- #worker == Either developer or agent working on repository
- #GitHuber == GitHub visitor (reads MD files, potential forker)
- #WebGuest == Visitor of deployed website (end user, no repo access)
- #forker == Developer who forked repo for their own business card

---

## WORKFLOW CYCLE

### Complete Process (table format for clarity)

| Step | Description | Layer | Artifact | Action |
|------|-------------|-------|----------|--------|
| 1. Input | #developer sends #message | → Enters | #developer-message | User types |
| 2. Retrieval | #agent fetches context via #tools | #unconscious → #conscious | #retrieved-context | Load files, docs |
| 3. Assembly | Combine into #instructions | #conscious | #instructions = #system-prompt + #developer-message + #retrieved-context | Compile |
| 4. Processing | #agent (uses #foundational-knowledge) | #foundational | - | Think & decide |
| 5. Output | #agent produces response/code | #conscious → Output | Code/response | Generate |
| 6. Storage | Update files, create #runbook | #conscious → #unconscious | Files saved, #runbook created | Save work |
| 7. Learning | Extract #lesson if reusable | #unconscious | #lesson file in `.cursor/lessons/` | Learn |

### Task Achievement Procedure

When completing a task, follow #procedure:task-achieving (to be documented in `.cursor/procedures/task-achieving.mdc`):

1. Load task from `.cursor/tasks/task-NNN.mdc`
2. Retrieve necessary context (files, rules, lessons)
3. Perform work
4. Update task status and outcome in task file
5. Generate runbook in `.cursor/runbooks/task-NNN.mdc`
6. **IF lesson is reusable**: Extract to `.cursor/lessons/[name].mdc` and link in runbook
7. Link lesson in task file: `lessons_learned: [lesson:name]`

This procedure itself should be documented in `.cursor/procedures/` and referenced by `.cursor/rules/tasks.mdc`.

---

## AUTOMATION APPROACH

### Phase 1: TypeScript Scripts (Now)

All scripts in **TypeScript** for consistency and MCP future-proofing.

Script naming: `script.{action}.ts` in respective folders

Package.json scripts:
```json
{
  "scripts": {
    "index:rules": "tsx .cursor/rules/script.index.ts",
    "index:decisions": "tsx .cursor/decisions/script.index.ts",
    "index:procedures": "tsx .cursor/procedures/script.index.ts",
    "index:tasks": "tsx .cursor/tasks/script.index.ts",
    "index:lessons": "tsx .cursor/lessons/script.index.ts"
  }
}
```

### Scripts to Create:

1. **Index Generators** (in each folder)
   - Read MDC headers
   - Generate INDEX.yaml (structured format)
   - Example: `.cursor/tasks/script.index.ts` reads all task-*.mdc headers

2. **Task Number Generator** (future)
   - Auto-increment task numbers
   - Inject creation date

3. **Runbook Generator** (future)
   - Template for agent to fill

### Phase 2: MCP Server (Future)

Document in `.cursor/rules/mcp-future.mdc`:
- Building MCP server over time
- Will be in TypeScript
- Will use TypeScript types from `.cursor/types/`
- Scripts written now are foundation for MCP tools later

---

## KEY DOCUMENTS TO CREATE

### 1. `.cursor/rules/dict.mdc` (PRIORITY 1)

Master document containing:
- Full #mind-theory explanation
- All definitions with #notation
- Mental architecture (3 layers)
- #omniscience principle (agent humility)
- Complete dictionary of all terms
- Relationship operators (==, ->)
- This is the foundation - always loaded

### 2. `.cursor/rules/tasks.mdc` (PRIORITY 2)

Rules about tasks:
- When to create tasks
- Task metadata requirements
- Reference to #procedure:task-defining
- Reference to #procedure:task-achieving
- How tasks link to runbooks and lessons

### 3. `.cursor/procedures/task-achieving.mdc` (PRIORITY 3)

Step-by-step process for completing tasks (detailed above in Workflow Cycle section)

### 4. `.cursor/procedures/task-defining.mdc` (PRIORITY 4)

Step-by-step process for creating new tasks

### 5. `.cursor/rules/mcp-future.mdc` (PRIORITY 5)

Vision document:
- Building MCP server in TypeScript
- Current scripts are foundation
- Will transition sh/manual → MCP tools
- Types in `.cursor/types/` will be used

### 6. Package.json setup (PRIORITY 6)

Add scripts for indexing as shown above

---

## CONCEPTS REQUIRING DEVELOPMENT

These concepts were mentioned but need further development (you will expand later):

1. **#progressive-disclosure** - How exactly does it work? Tree structure? Interlinking patterns?
2. **Tagging system** - Comprehensive tagging approach across all content
3. **#lesson extraction criteria** - When is a lesson "reusable" enough to extract?
4. **INDEX.yaml structure** - Exact schema for generated indexes
5. **Types in `.cursor/types/`** - What types need to be defined?
6. **Spectory session integration** - How to link/reference existing sessions?
7. **Forker customization checklist** - Complete list in `forking.mdc`
8. **GitHuber → Forker conversion path** - Detailed journey in CONTRIBUTIONS.md

---

## IMPLEMENTATION ORDER

### Phase 1: Foundation
1. Create folder structure in `.cursor/`
2. Create `package.json` with index scripts
3. Write `.cursor/rules/dict.mdc` (master mind theory + dictionary)
4. Write `.cursor/rules/tasks.mdc` (references procedures)
5. Write `.cursor/rules/mcp-future.mdc` (vision)

### Phase 2: Procedures
6. Write `.cursor/procedures/task-achieving.mdc`
7. Write `.cursor/procedures/task-defining.mdc`
8. Create procedure INDEX (can be manual initially)

### Phase 3: Scripts
9. Create `.cursor/tasks/script.index.ts`
10. Create other indexing scripts as needed
11. Test with `npm run index:tasks`

### Phase 4: First Real Usage
12. Create first real task using the system
13. Complete task following procedure
14. Generate first runbook
15. Extract first lesson
16. Iterate and improve

---

## CRITICAL REMINDERS FOR AGENT

1. **Always use #notation** - No backticks for concepts, only for code
2. **All worker files are .mdc** - Never .md in `.cursor/`
3. **Be humble** - You don't have #omniscience, always verify
4. **Use #progressive-disclosure** - Load incrementally, don't assume you have everything
5. **Follow procedures** - When they exist, reference and follow them
6. **Generate runbooks** - Document your work for learning
7. **Extract lessons** - When something is reusable, save it to `.cursor/lessons/`
8. **Use shortcodes** - Always link with `[type:id]` format
9. **TypeScript for scripts** - Future-proof for MCP transition
10. **INDEX files are generated** - Don't manually maintain, use scripts

---

## OPEN SYSTEM PRINCIPLE

This system is **open to evolution**. The agent should:
- Suggest improvements to mind theory
- Propose new procedures when patterns emerge
- Create new lesson types if needed
- Expand the dictionary organically
- **List concepts that need development** (as shown above)

Don't assume completion - assume continuous growth and refinement.

---

**This document is your implementation guide. Start with Phase 1, create the foundation, and build from there. Ask questions if anything is unclear.**
