# Decisions

Architectural decisions and rationale.

## TypeScript + ESM

**Decision**: Use TypeScript with ESM modules.

**Rationale**: Modern standard, better type safety, aligns with Mineflayer ecosystem direction.

## Mineflayer Direct Integration

**Decision**: Use Mineflayer directly rather than a wrapper.

**Rationale**: Mineflayer is stable and well-documented. Direct integration gives full control over the API surface.

## Event-Driven Architecture

**Decision**: Central EventManager for all internal events.

**Rationale**: Decouples systems. Plugins, commands, and behaviors can react to events without tight coupling.

## Zod for Configuration

**Decision**: Use Zod for environment variable validation.

**Rationale**: Type-safe, provides clear error messages, fails fast on invalid config.

## Winston for Logging

**Decision**: Use Winston for structured logging.

**Rationale**: Supports multiple transports, log levels, and formatting. Industry standard.

## Bot Abstraction Layer

**Decision**: Encapsulate Mineflayer in a `Bot` class.

**Rationale**: Hides Mineflayer internals from the rest of the application. Allows swapping the underlying library if needed.

## Plugin System

**Decision**: Dynamic plugin discovery from a directory.

**Rationale**: Allows extending the bot without modifying core code. Supports third-party plugins.

## AI-Ready Interfaces

**Decision**: Define AI service interfaces now, implement later.

**Rationale**: Prevents architectural drift. Future AI integration requires minimal changes.

## No Global State

**Decision**: Avoid global mutable state.

**Rationale**: Easier testing, fewer bugs, better maintainability.

## Single Responsibility

**Decision**: Small, focused modules.

**Rationale**: Easier to understand, test, and modify individual components.