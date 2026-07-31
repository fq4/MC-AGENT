# Implement MC-Agent Project Specification

## Objective

Implement the project defined in:

```
docs/PROJECT_SPEC.md
```

This file is the authoritative source of truth for the project requirements, architecture, coding standards, and engineering expectations.

Your task is to fully implement the specification.

Do not create a simplified prototype.
Do not skip sections because they appear optional.
Do not replace architecture with a quick single-file implementation.

Build the project as if it will be maintained as a long-term open-source framework.

---

# Phase 1: Understand Before Coding

Before making changes:

1. Read and understand `docs/PROJECT_SPEC.md` completely.
2. Inspect the current workspace.
3. Determine:
   - existing files
   - existing dependencies
   - existing Node.js version
   - existing Git status
   - existing project structure
4. Identify conflicts between the specification and the current workspace.
5. Create an implementation plan before writing code.

If the specification contains outdated dependencies or approaches:

- research the current maintained alternative
- choose the best replacement
- document the decision

Do not blindly follow outdated examples.

---

# Phase 2: Project Initialization

Create the project:

```
mc-agent
```

If the project already exists:

- preserve useful existing work
- refactor where necessary
- do not overwrite blindly

Initialize Git if needed.

Create:

- package.json
- tsconfig.json
- eslint configuration
- prettier configuration
- .gitignore
- README.md
- CHANGELOG.md

---

# Phase 3: Implement Architecture First

Before adding features:

Create the complete directory structure defined in:

```
docs/PROJECT_SPEC.md
```

Implement the foundational systems first:

1. Configuration
2. Logging
3. Error handling
4. Types/interfaces
5. Event system
6. Plugin architecture
7. Bot abstraction layer

The project should have a clean foundation before implementing commands or behaviors.

---

# Phase 4: Dependency Management

Install all required dependencies.

Verify:

- package versions are current
- packages support the target Minecraft version
- no deprecated libraries are used

If substitutions are necessary:

Update:

- README.md
- CHANGELOG.md
- architecture documentation

Explain:

- what changed
- why it changed
- what compatibility impact exists

---

# Phase 5: Implementation Rules

While coding:

Follow these rules:

## TypeScript

- Enable strict mode.
- Avoid `any`.
- Use interfaces.
- Use proper typing.
- Keep modules focused.
- Avoid circular dependencies.

## Architecture

Do not:

- put everything in index.ts
- create giant classes
- tightly couple systems
- expose Mineflayer internals everywhere

Do:

- create services
- use dependency boundaries
- use events for communication
- keep components replaceable

## Maintainability

Every major feature should be:

- documented
- tested
- independently understandable

---

# Phase 6: Implement Features

Implement all required functionality from:

```
docs/PROJECT_SPEC.md
```

Including:

## Bot System

- connection management
- reconnection
- movement
- interaction
- mining
- collecting
- crafting
- combat
- inventory
- task cancellation

## Plugin System

- discovery
- loading
- registration
- lifecycle handling
- error isolation

## Event System

Support all required events.

## Commands

Implement automatic command registration.

Include:

- follow
- stop
- goto
- mine
- collect
- attack
- inventory
- say

## Behaviors

Create the behavior framework.

Do not hardcode behaviors into commands.

## AI Preparation

Implement interfaces/placeholders for:

- planning
- memory
- world knowledge
- tools
- scheduling
- decision making

These should be ready for future LLM integration.

---

# Phase 7: Testing and Verification

After implementation:

Run:

```
npm install
npm run build
npm run lint
npm run format
npm run test
```

Fix all errors.

The final project should:

- compile successfully
- start successfully
- load configuration
- initialize logging
- load plugins
- register commands
- connect to Minecraft using environment variables

Do not leave broken code.

---

# Phase 8: Documentation

Ensure documentation exists for:

- installation
- configuration
- architecture
- development workflow
- plugin creation
- command creation
- behavior creation
- troubleshooting
- future roadmap

Update documentation whenever implementation decisions differ from the original specification.

---

# Phase 9: Final Review

Before declaring completion, perform a senior engineer review.

Check:

## Architecture

- Is the code modular?
- Can features be added without major rewrites?
- Are responsibilities separated?

## Code Quality

- Is TypeScript clean?
- Are errors handled?
- Are names descriptive?
- Is the code understandable?

## Future Proofing

Could this project reasonably grow into:

- multiple Minecraft bots
- a web dashboard
- REST/WebSocket APIs
- persistent memory
- local LLM integration
- autonomous planning?

If not, improve the architecture.

---

# Final Response

When complete, provide:

1. Summary of what was implemented.
2. Files created or modified.
3. Dependencies installed.
4. Architectural decisions made.
5. Any substitutions or compatibility decisions.
6. Tests performed.
7. Any remaining limitations.

Do not claim completion until the project actually builds successfully.