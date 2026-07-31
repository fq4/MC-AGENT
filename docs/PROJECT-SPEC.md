# MC-Agent Project Specification

## Objective

Create a new project named `mc-agent` in the current VS Code workspace.

The objective is to build a modern, production-quality, headless Minecraft Java Edition agent targeting the latest stable Minecraft version. The project should be designed for long-term maintainability, extensibility, testing, and future AI integration.

The finished project should follow modern TypeScript development practices and serve as a solid foundation for autonomous Minecraft agents.

---

# Development Principles

Throughout this project, prioritize the following in order:

1. Correctness
2. Readability
3. Maintainability
4. Extensibility
5. Testability
6. Performance
7. Simplicity

Never sacrifice maintainability for clever code.

Assume this project will continue to evolve for years.

---

# Engineering Best Practices

## Before Writing Code

Before implementing any feature:

- Research the latest Mineflayer documentation and ecosystem.
- Verify APIs against current maintained documentation.
- Avoid deprecated packages and APIs.
- Prefer officially maintained libraries.
- Consider edge cases before implementation.
- Design every component for future extensibility.

Do not blindly copy examples from outdated tutorials.

---

## Coding Standards

Use modern TypeScript.

Requirements:

- Strict TypeScript mode
- No `any` unless absolutely unavoidable
- Strong typing throughout
- Favor composition over inheritance
- Single Responsibility Principle
- Dependency Injection where appropriate
- Small, focused modules
- Avoid global mutable state
- Avoid circular dependencies
- Prefer async/await
- Comprehensive error handling
- Reusable utility functions

Large functions should be broken into smaller reusable functions.

---

## Code Style

Configure:

- ESLint
- Prettier
- EditorConfig

Use:

- descriptive class names
- descriptive function names
- descriptive variable names

Readable code should eliminate the need for excessive comments.

---

## Documentation

Document every public class and method.

Include:

- Purpose
- Parameters
- Return values
- Possible exceptions
- Usage examples where appropriate

Explain **why** something exists instead of simply describing what the code does.

---

## Logging

Use Winston.

Support:

- error
- warn
- info
- debug

Never rely on `console.log()` outside initial startup.

---

## Configuration

Use:

- dotenv
- zod

Validate every environment variable during startup.

Invalid configuration should produce clear human-readable errors and stop execution.

---

## Error Handling

Never silently swallow exceptions.

Recover from recoverable failures.

Fail fast for unrecoverable configuration or startup errors.

Provide meaningful log messages.

---

## Testing

As development progresses:

- Verify TypeScript compilation
- Verify linting
- Verify formatting
- Verify application startup
- Verify runtime behavior

Do not leave the project in a broken state after implementing a feature.

---

## Git

If a Git repository does not already exist:

- Initialize one.

Create an appropriate `.gitignore` that excludes:

- node_modules
- logs
- build output
- temporary files
- IDE files
- environment secrets

---

# Project Structure

```
mc-agent/
├── src/
│   ├── bot/
│   ├── commands/
│   ├── behaviors/
│   ├── goals/
│   ├── services/
│   ├── plugins/
│   ├── memory/
│   ├── events/
│   ├── config/
│   ├── logger/
│   ├── types/
│   ├── utils/
│   └── index.ts
├── tests/
├── data/
├── logs/
├── docs/
├── scripts/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── CHANGELOG.md
```

---

# Technology Stack

Use:

- Node.js (current LTS)
- TypeScript
- npm

Install and configure the latest compatible versions of:

- mineflayer
- mineflayer-pathfinder
- mineflayer-pvp
- mineflayer-auto-eat
- mineflayer-collectblock
- prismarine-viewer
- dotenv
- zod
- winston
- uuid

If a dependency has been deprecated or superseded:

- Use the maintained alternative.
- Document the substitution.
- Explain compatibility decisions in the README and CHANGELOG.

---

# npm Scripts

Provide scripts for:

```
npm run build
npm run dev
npm run start
npm run lint
npm run lint:fix
npm run format
npm run test
npm run clean
```

---

# Configuration

Support the following environment variables:

- Server IP
- Server Port
- Username
- Authentication Type
- Viewer Enabled
- Logging Level
- Reconnect Delay
- Maximum Reconnect Attempts
- Default Follow Distance
- Default Movement Speed

Generate a complete `.env.example`.

---

# Bot Class

Create a `Bot` class that encapsulates the Mineflayer instance.

Expose methods including:

- connect()
- disconnect()
- reconnect()
- chat()
- moveTo()
- followPlayer()
- mineBlock()
- collectBlock()
- attack()
- equip()
- craft()
- sleep()
- eat()
- stopCurrentTask()

Mineflayer internals should remain encapsulated.

---

# Plugin System

Implement automatic plugin discovery.

Plugins should:

- register automatically
- be validated
- be loaded dynamically
- support unloading
- isolate failures from the rest of the application

Adding a plugin should never require modifying core code.

---

# Event System

Implement centralized event registration.

Log:

- login
- spawn
- respawn
- death
- disconnect
- kicked
- chat
- whisper
- health
- food
- inventory
- movement
- pathfinding
- entity interactions
- errors

Plugins should be able to subscribe to events without modifying the event manager.

---

# Command Framework

Each command should exist as an individual file.

Commands should self-register automatically.

Include sample commands:

- follow
- stop
- goto
- mine
- collect
- attack
- inventory
- say

Each command should expose metadata including:

- name
- aliases
- description
- usage
- arguments
- permissions

---

# Behaviors

Behaviors should remain separate from commands.

Prepare for behaviors including:

- Auto Eat
- Auto Sleep
- Avoid Lava
- Avoid Hostile Mobs
- Idle
- Follow Player
- Explore
- Gather Resources

Behaviors should be independently enabled and disabled.

---

# AI Architecture

Prepare the project for future AI integration.

Create placeholder services for:

- Goal Planning
- Long-Term Memory
- Short-Term Memory
- World Knowledge
- Tool Execution
- Task Scheduling
- Decision Making
- Conversation
- Perception

Use interfaces so these services can later be backed by OpenAI, local LLMs, or other AI providers without refactoring the rest of the application.

---

# Future Expansion

Design the architecture so it can later support:

- Multiple bots
- REST API
- WebSocket API
- Discord integration
- Web dashboard
- Persistent databases
- Vector memory
- Local LLMs
- OpenAI
- Anthropic
- Plugin marketplace
- Behavior Trees
- Finite State Machines
- Autonomous planning

These additions should require minimal changes to existing code.

---

# Security

- Never commit secrets.
- Never hardcode credentials.
- Validate external input.
- Handle malformed commands gracefully.
- Fail securely.

---

# Documentation

Generate comprehensive documentation.

## README

Include:

- Installation
- Requirements
- Configuration
- Environment Variables
- Running
- Development
- Architecture
- Folder Structure
- Plugin Development
- Behavior Development
- Command Development
- Troubleshooting
- Roadmap

---

## CHANGELOG

Document:

- Dependency substitutions
- Compatibility notes
- Architectural decisions
- Known limitations

---

## Architecture Documentation

Document:

- Dependency graph
- Folder organization
- Plugin lifecycle
- Event flow
- Command lifecycle
- Behavior lifecycle

---

# Final Verification

Before considering the project complete:

- Install all dependencies successfully.
- Resolve dependency conflicts.
- Verify compatibility with the latest supported Minecraft version.
- Ensure TypeScript builds without errors.
- Ensure ESLint reports no errors.
- Ensure Prettier formatting passes.
- Verify all npm scripts execute successfully.
- Verify the bot starts successfully.
- Verify connection to a Minecraft server using environment variables.
- Verify automatic reconnection.
- Verify automatic command registration.
- Verify automatic plugin loading.
- Verify logging.
- Verify configuration validation.
- Verify no deprecated APIs remain.
- Ensure there are no unexplained TODOs.

If newer maintained libraries or architectural patterns are discovered during implementation, prefer them over outdated approaches and document every decision in the project documentation.