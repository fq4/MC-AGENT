# AI Architecture

MC-Agent is designed to be AI-ready. The service interfaces are defined now so they can be backed by any AI provider later without refactoring the rest of the application.

## Service Interfaces

### GoalPlanner

Breaks down high-level objectives into executable tasks.

```typescript
interface GoalPlanner {
  plan(bot: Bot): Promise<string[]>;
}
```

### ToolExecutor

Executes tools (functions) and returns results.

```typescript
interface ToolExecutor {
  execute(tool: string, params: Record<string, unknown>): Promise<ToolExecutionResult>;
}
```

### TaskScheduler

Schedules recurring tasks with cancellation support.

```typescript
interface TaskScheduler {
  schedule(name: string, interval: number, execute: () => Promise<void>): () => void;
  cancelAll(): void;
}
```

### DecisionMaker

Makes decisions from a set of options.

```typescript
interface DecisionMaker {
  decide(options: string[]): Promise<string>;
}
```

### ConversationManager

Manages conversation history and sends messages to an LLM.

```typescript
interface ConversationManager {
  sendMessage(message: string): Promise<string>;
}
```

### PerceptionEngine

Gathers perception data from the world.

```typescript
interface PerceptionEngine {
  perceive(bot: Bot): Promise<PerceptionResult>;
}
```

## Future Integration

These interfaces can be backed by:
- OpenAI API (GPT-4)
- Anthropic API (Claude)
- Local LLMs via Ollama
- Custom fine-tuned models

## Memory System

- **ShortTermMemory**: TTL-based, for current session context
- **LongTermMemory**: Persistent, for cross-session knowledge

## World Knowledge

Stores information about blocks, entities, and recipes for AI reasoning.

## Tool Execution

Tools are functions the AI can call. Each tool has a name, parameters, and a return type. The ToolExecutor validates parameters and executes the function.