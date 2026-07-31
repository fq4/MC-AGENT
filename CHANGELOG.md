# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-07-31

### Added
- Initial project scaffolding
- Bot class with connection management and reconnection
- Event system with centralized event registration
- Command framework with auto-registration
- Behavior system with toggle support
- Plugin system with discovery and lifecycle management
- Configuration with Zod validation
- Winston logging with file and console transports
- TypeScript strict mode with comprehensive type definitions
- ESLint and Prettier configuration
- Sample commands: follow, stop, goto, mine, collect, attack, inventory, say
- Sample behaviors: auto-eat, follow-player, idle, explore, gather-resources
- AI service placeholders: GoalPlanner, ToolExecutor, TaskScheduler, DecisionMaker
- Memory system: ShortTermMemory, LongTermMemory
- npm scripts: build, dev, start, lint, lint:fix, format, test, clean

### Dependencies
- mineflayer ^4.37.0
- mineflayer-pathfinder ^2.4.5
- mineflayer-pvp ^1.3.2
- mineflayer-auto-eat ^5.0.3
- mineflayer-collectblock ^1.6.0
- prismarine-viewer ^1.33.0
- dotenv ^16.4.0
- zod ^3.23.0
- winston ^3.13.0
- uuid ^9.0.0

### Notes
- Project targets Node.js >= 22.0.0
- ESM modules used throughout
- Strict TypeScript mode enabled