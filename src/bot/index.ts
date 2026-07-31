import mineflayer, { Bot as MineflayerBot, BotOptions } from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import { plugin as pvpPlugin } from "mineflayer-pvp";
import { mineflayer as viewer } from "prismarine-viewer";
import { createLogger, Logger } from "../logger/index.js";
import { eventManager, EventManager } from "../events/index.js";
import { commandRegistry, CommandExecutor } from "../commands/index.js";
import { behaviorManager } from "../behaviors/index.js";
import { PluginManager } from "../plugins/index.js";
import { BotConfig } from "../types/index.js";

export class Bot {
  private mineflayerBot: MineflayerBot | null = null;
  private logger: Logger;
  private reconnectAttempts = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private currentTask: (() => void) | null = null;
  private isConnected = false;
  private viewerStarted = false;

  public readonly commands = commandRegistry;
  public readonly commandExecutor = new CommandExecutor(this.commands);
  public readonly behaviors = behaviorManager;
  public readonly plugins = new PluginManager();
  public readonly events: EventManager = eventManager;

  constructor(private readonly botConfig: BotConfig) {
    this.logger = createLogger(botConfig);
  }

  async connect(): Promise<void> {
    try {
      this.logger.info(`Connecting to ${this.botConfig.serverHost}:${this.botConfig.serverPort} as ${this.botConfig.username}`);

      const authValue = this.botConfig.authenticationType === "offline"
        ? false
        : this.botConfig.authenticationType === "microsoft" && this.botConfig.microsoftRefreshToken
          ? { type: "microsoft" as const, refreshToken: this.botConfig.microsoftRefreshToken }
          : (this.botConfig.authenticationType as "microsoft" | "mojang");

      const options = {
        host: this.botConfig.serverHost,
        port: this.botConfig.serverPort,
        username: this.botConfig.username,
        auth: authValue,
      } as BotOptions;

      this.mineflayerBot = mineflayer.createBot(options);
      (this.mineflayerBot as MineflayerBot & Record<string, unknown>).loadPlugin?.(pathfinder as unknown as Parameters<MineflayerBot["loadPlugin"]>[0]);
      (this.mineflayerBot as MineflayerBot & Record<string, unknown>).loadPlugin?.(pvpPlugin as unknown as Parameters<MineflayerBot["loadPlugin"]>[0]);
      this.setupEventListeners();
      this.isConnected = true;
      this.reconnectAttempts = 0;
    } catch (error) {
      this.logger.error("Failed to connect:", error as Error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.stopCurrentTask();

    if (this.mineflayerBot) {
      this.mineflayerBot.removeAllListeners();
      this.mineflayerBot.end();
      this.mineflayerBot = null;
    }

    this.isConnected = false;
    this.logger.info("Disconnected from server");
  }

  async reconnect(): Promise<void> {
    await this.disconnect();
    await this.connect();
  }

  private setupEventListeners(): void {
    if (!this.mineflayerBot) {return;}

    const bot = this.mineflayerBot;

    bot.once("login", () => {
      this.logger.info("Logged in successfully");
      this.events.emit("bot:login", { username: bot.username });
    });

    bot.once("spawn", () => {
      this.logger.info("Bot spawned in the world");
      if (bot.entity) {
        this.events.emit("bot:spawn", {
          position: {
            x: bot.entity.position.x,
            y: bot.entity.position.y,
            z: bot.entity.position.z,
          },
        });
      }

      if (this.botConfig.viewerEnabled && !this.viewerStarted) {
        this.viewerStarted = true;
        try {
          viewer(this.mineflayerBot!, {});
          this.logger.info("Viewer enabled");
        } catch (error) {
          this.logger.warn("Failed to start viewer:", error as Error);
        }
      }
    });

    bot.on("respawn", () => {
      this.logger.info("Bot respawned");
      this.events.emit("bot:respawn", {});
    });

    bot.on("death", () => {
      this.logger.warn("Bot died");
      this.events.emit("bot:death", {});
    });

    bot.on("end", (reason: string) => {
      this.logger.warn(`Disconnected: ${reason}`);
      this.isConnected = false;
      this.events.emit("bot:disconnect", { reason });
      this.attemptReconnect();
    });

    bot.on("kicked", (reason) => {
      this.logger.warn(`Kicked from server: ${reason}`);
      this.events.emit("bot:kicked", { reason });
    });

    bot.on("chat", (username, message) => {
      this.logger.debug(`Chat: <${username}> ${message}`);
      this.events.emit("bot:chat", { sender: username, message });
    });

    bot.on("whisper", (username, message) => {
      this.logger.debug(`Whisper from ${username}: ${message}`);
      this.events.emit("bot:whisper", { sender: username, message });
    });

    bot.on("message", (message) => {
      this.logger.debug(`Message: ${JSON.stringify(message)}`);
    });

    bot.on("actionBar", (message) => {
      this.logger.debug(`ActionBar: ${JSON.stringify(message)}`);
    });

    bot.on("health", () => {
      this.events.emit("bot:health", { health: bot.health });
    });

    (bot as unknown as { on: (_event: string, _handler: (..._args: unknown[]) => void) => void }).on("inventoryUpdated", () => {
      this.events.emit("bot:inventory", { item: "updated" });
    });

    bot.on("move", () => {
      if (bot.entity) {
        this.events.emit("bot:movement", {
          position: {
            x: bot.entity.position.x,
            y: bot.entity.position.y,
            z: bot.entity.position.z,
          },
        });
      }
    });

    (bot as MineflayerBot & Record<string, unknown>).on("path_update", (result: unknown) => {
      const isMoving = (result as { isMoving?: boolean }).isMoving ?? false;
      this.events.emit("bot:pathfinding", { status: isMoving ? "moving" : "stuck" });
    });

    bot.on("error", (err) => {
      this.logger.error("Bot error:", err);
      this.events.emit("bot:error", { error: err });
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.botConfig.maxReconnectAttempts) {
      this.logger.error("Max reconnect attempts reached, giving up");
      return;
    }

    this.reconnectAttempts++;
    this.logger.info(`Attempting reconnect ${this.reconnectAttempts}/${this.botConfig.maxReconnectAttempts} in ${this.botConfig.reconnectDelay}ms`);

    this.reconnectTimeout = setTimeout(async () => {
      try {
        await this.connect();
      } catch {
        this.attemptReconnect();
      }
    }, this.botConfig.reconnectDelay);
  }

  chat(message: string): void {
    if (!this.mineflayerBot) {return;}
    this.mineflayerBot.chat(message);
  }

  async moveTo(x: number, y: number, z: number): Promise<void> {
    if (!this.mineflayerBot) {return;}
    await this.mineflayerBot.pathfinder.setGoal(
      { x, y, z } as unknown as Parameters<typeof this.mineflayerBot.pathfinder.setGoal>[0],
      true
    );
  }

  async followPlayer(username: string): Promise<void> {
    if (!this.mineflayerBot) {return;}
    const entity = this.mineflayerBot.players[username]?.entity;
    if (!entity) {
      throw new Error(`Player ${username} not found`);
    }
    await (this.mineflayerBot.pathfinder as unknown as { follow: (_entity: unknown, _distance: number) => Promise<void> }).follow(entity, this.botConfig.defaultFollowDistance);
  }

  async mineBlock(blockName: string): Promise<void> {
    if (!this.mineflayerBot) {return;}
    const block = this.mineflayerBot.findBlock({
      matching: (b) => b.name === blockName,
      maxDistance: 32,
    });

    if (!block) {
      throw new Error(`Block ${blockName} not found nearby`);
    }

    await this.mineflayerBot.pathfinder.setGoal(
      { x: block.position.x, y: block.position.y, z: block.position.z } as unknown as Parameters<typeof this.mineflayerBot.pathfinder.setGoal>[0],
      true
    );

    await this.mineflayerBot.dig(block);
  }

  async attack(entity: MineflayerBot["entity"]): Promise<void> {
    if (!this.mineflayerBot || !entity) {return;}
    if ("pvp" in this.mineflayerBot) {
      (this.mineflayerBot as MineflayerBot & { pvp: { attack: (_entity: unknown) => Promise<void> } }).pvp.attack(entity);
    }
  }

  async equip(itemName: string): Promise<void> {
    if (!this.mineflayerBot) {return;}
    const item = this.mineflayerBot.inventory.items().find((i) => i.name === itemName);
    if (!item) {
      throw new Error(`Item ${itemName} not found in inventory`);
    }
    await this.mineflayerBot.equip(item, "hand");
  }

  async craft(recipe: unknown): Promise<void> {
    if (!this.mineflayerBot) {return;}
    await this.mineflayerBot.craft(recipe as Parameters<typeof this.mineflayerBot.craft>[0]);
  }

  async sleep(): Promise<void> {
    if (!this.mineflayerBot) {return;}
    const bed = this.mineflayerBot.findBlock({
      matching: (b) => b.name.includes("bed"),
      maxDistance: 16,
    });
    if (bed) {
      await this.mineflayerBot.sleep(bed);
    }
  }

  async eat(): Promise<void> {
    if (!this.mineflayerBot) {return;}
    const foodItem = this.mineflayerBot.inventory.items().find((i) => {
      const foodValue = (i as { food?: number }).food;
      return foodValue !== undefined && foodValue > 0;
    });
    if (foodItem) {
      await this.mineflayerBot.equip(foodItem, "hand");
      await this.mineflayerBot.activateItem();
    }
  }

  stopCurrentTask(): void {
    if (this.currentTask) {
      this.currentTask();
      this.currentTask = null;
    }
  }

  getMineflayerBot(): MineflayerBot | null {
    return this.mineflayerBot;
  }

  get isReady(): boolean {
    return this.isConnected && this.mineflayerBot !== null;
  }

  get loggerInstance(): Logger {
    return this.logger;
  }
}