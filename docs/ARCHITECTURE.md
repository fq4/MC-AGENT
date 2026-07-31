# Architecture

## Overview

MC-Agent uses a layered, event-driven architecture designed for long-term maintainability and extensibility.

## Dependency Graph

```
src/index.ts
  ├── src/config/index.ts       (Zod-validated env configuration)
  ├── src/logger/index.ts       (Winston logger)
  ├── src/bot/index.ts          (Bot abstraction)
  │     ├── src/events/index.ts (Event manager)
  │     ├── src/commands/       (Command registry + executor)
  │     ├── src/behaviors/      (Behavior manager)
  │     └── src/plugins/        (Plugin manager)
  ├── src/types/index.ts        (Shared interfaces)
  └── src/utils/index.ts        (Utility functions)
```

## Layer Responsibilities

### Entry Point (`src/index.ts`)
Initializes configuration, logging, bot instance, registers commands and behaviors, and starts the connection.

### Bot Layer (`src/bot/`)
Encapsulates the Mineflayer instance. Exposes high-level methods (`chat`, `moveTo`, `followPlayer`, `mineBlock`, etc.) while keeping Mineflayer internals private.

### Event System (`src/events/`)
Centralized event registration. Plugins, commands, and behaviors subscribe to events without modifying the event manager.

### Command Framework (`src/commands/`)
- `registry.ts`: Stores and retrieves commands by name/alias
- `index.ts`: Auto-registers all sample commands
- `commands.ts`: Individual command implementations

### Behavior System (`src/behaviors/`)
- `index.ts`: BehaviorManager with start/stop/toggle
- `behaviors.ts`: Concrete behavior implementations

### Plugin System (`src/plugins/`)
- Discovers plugins from a directory
- Validates and loads them dynamically
- Supports unloading
- Isolates failures from the rest of the application

### Services (`src/services/`)
Placeholder services for future AI integration:
- GoalPlanner
- ToolExecutor
- TaskScheduler
- DecisionMaker

### Memory (`src/memory/`)
- ShortTermMemory: TTL-based entries
- LongTermMemory: Persistent entries with search

### Configuration (`src/config/`)
Zod-validated environment variables. Invalid config produces clear errors and stops execution.

### Logging (`src/logger/`)
Winston logger with console, error file, and combined file transports.

## Event Flow

1. Mineflayer emits a native event (e.g., `chat`)
2. Bot's event listener captures it
3. Bot emits a custom event via `EventManager` (e.g., `bot:chat`)
4. Subscribers (commands, behaviors, plugins) react

## Plugin Lifecycle

1. Discovery: `PluginManager.loadPluginsFromDirectory()` scans a directory
2. Validation: Plugin must have a valid `PluginManifest`
3. Registration: `plugin.register(bot)` is called
4. Execution: Plugin subscribes to events and modifies bot behavior
5. Unloading: `plugin.unregister(bot)` is called, listeners removed

## Command Lifecycle

1. Registration: `registerCommands()` registers all commands at startup
2. Invocation: Chat message matches command name or alias
3. Execution: `CommandExecutor.execute()` runs the command
4. Response: Command sends chat feedback or performs actions