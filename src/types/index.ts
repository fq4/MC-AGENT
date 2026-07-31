export interface BotConfig {
  serverHost: string;
  serverPort: number;
  username: string;
  authenticationType: "microsoft" | "mojang" | "offline";
  viewerEnabled: boolean;
  loggingLevel: "error" | "warn" | "info" | "debug";
  reconnectDelay: number;
  maxReconnectAttempts: number;
  defaultFollowDistance: number;
  defaultMovementSpeed: number;
  microsoftRefreshToken?: string | undefined;
  serverPassword?: string | undefined;
}

export interface CommandMetadata {
  name: string;
  aliases: string[];
  description: string;
  usage: string;
  arguments: string[];
  permissions: string[];
}

export interface CommandContext {
  bot: Bot;
  args: string[];
  sender: string;
}

export interface Command {
  metadata: CommandMetadata;
  execute: (ctx: CommandContext) => Promise<void> | void;
}

export interface BehaviorMetadata {
  name: string;
  description: string;
}

export interface Behavior {
  metadata: BehaviorMetadata;
  start: (bot: Bot) => Promise<void> | void;
  stop: (bot: Bot) => Promise<void> | void;
  isEnabled: boolean;
  toggle: (enabled: boolean) => void;
}

export interface Plugin {
  name: string;
  version: string;
  description: string;
  register: (bot: Bot) => Promise<void> | void;
  unregister: (bot: Bot) => Promise<void> | void;
}

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  main: string;
}

export interface EventMap {
  "bot:login": { username: string };
  "bot:spawn": { position: { x: number; y: number; z: number } };
  "bot:respawn": {};
  "bot:death": {};
  "bot:disconnect": { reason: string };
  "bot:kicked": { reason: string };
  "bot:chat": { sender: string; message: string };
  "bot:whisper": { sender: string; message: string };
  "bot:health": { health: number };
  "bot:food": { food: number };
  "bot:inventory": { item: string };
  "bot:movement": { position: { x: number; y: number; z: number } };
  "bot:pathfinding": { status: string };
  "bot:entity_interaction": { entityType: string; action: string };
  "bot:error": { error: Error };
  "bot:systemMessage": { message: string };
}

export type EventName = keyof EventMap;
export type EventData<T extends EventName> = EventMap[T];

export type EventHandler<T extends EventName> = (data: EventData<T>) => void;

export interface EventSubscription {
  event: EventName;
  handler: EventHandler<any>;
}

export interface GoalResult {
  success: boolean;
  reason: string;
  data?: Record<string, unknown>;
}

export interface Goal {
  id: string;
  name: string;
  priority: number;
  execute: (bot: Bot) => Promise<GoalResult>;
  isComplete: (bot: Bot) => boolean;
  cancel: (bot: Bot) => void;
}

export interface MemoryEntry {
  id: string;
  type: "short-term" | "long-term";
  key: string;
  value: unknown;
  createdAt: number;
  expiresAt?: number;
}

export interface WorldKnowledge {
  blockType: string;
  properties: Record<string, unknown>;
  harvestTime: number;
  toolRequired: string;
}

export interface ToolExecutionResult {
  success: boolean;
  output: string;
  error?: string;
}

export interface ScheduledTask {
  id: string;
  name: string;
  interval: number;
  execute: () => Promise<void> | void;
  cancel: () => void;
}

export interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface PerceptionResult {
  entities: Array<{
    type: string;
    position: { x: number; y: number; z: number };
    distance: number;
  }>;
  blocks: Array<{
    type: string;
    position: { x: number; y: number; z: number };
  }>;
  health: number;
  food: number;
  inventory: Array<{
    name: string;
    count: number;
  }>;
}

export interface Bot {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  reconnect(): Promise<void>;
  chat(message: string): void;
  moveTo(x: number, y: number, z: number): Promise<void>;
  followPlayer(username: string): Promise<void>;
  mineBlock(blockName: string): Promise<void>;
  attack(entity: unknown): Promise<void>;
  equip(itemName: string): Promise<void>;
  craft(recipe: unknown): Promise<void>;
  sleep(): Promise<void>;
  eat(): Promise<void>;
  stopCurrentTask(): void;
  getMineflayerBot(): unknown;
  isReady: boolean;
  commands: { has(name: string): boolean; register(cmd: Command): void };
  commandExecutor: { execute(name: string, ctx: CommandContext): Promise<boolean> };
  behaviors: { register(behavior: Behavior): void; start(name: string, bot: Bot): Promise<void> };
  plugins: { loadPlugin(plugin: Plugin): Promise<void> };
  events: { on<T extends EventName>(event: T, handler: EventHandler<T>): () => void; emit<T extends EventName>(event: T, data: EventData<T>): void };
}