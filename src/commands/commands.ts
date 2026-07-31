import { CommandContext } from "../types/index.js";
import { createLogger } from "../logger/index.js";

const logger = createLogger({
  serverHost: "localhost",
  serverPort: 25565,
  username: "mc-agent",
  authenticationType: "offline",
  viewerEnabled: false,
  loggingLevel: "info",
  reconnectDelay: 5000,
  maxReconnectAttempts: 10,
  defaultFollowDistance: 6,
  defaultMovementSpeed: 1.2,
});

export const followCommand = {
  metadata: {
    name: "follow",
    aliases: ["followplayer", "fp"],
    description: "Follow a player",
    usage: "follow <username>",
    arguments: ["username"],
    permissions: [],
  },
  execute: async (ctx: CommandContext) => {
    if (ctx.args.length === 0) {
      ctx.bot.chat("Usage: follow <username>");
      return;
    }

    const username = ctx.args[0] as string;
    logger.info(`Following player: ${username}`);
    await ctx.bot.followPlayer(username);
    ctx.bot.chat(`Now following ${username}`);
  },
};

export const stopCommand = {
  metadata: {
    name: "stop",
    aliases: ["halt", "cancel"],
    description: "Stop current task",
    usage: "stop",
    arguments: [],
    permissions: [],
  },
  execute: async (ctx: CommandContext) => {
    ctx.bot.stopCurrentTask();
    ctx.bot.chat("Stopped current task");
  },
};

export const gotoCommand = {
  metadata: {
    name: "goto",
    aliases: ["move", "walk"],
    description: "Move to a location",
    usage: "goto <x> <y> <z>",
    arguments: ["x", "y", "z"],
    permissions: [],
  },
  execute: async (ctx: CommandContext) => {
    if (ctx.args.length < 3) {
      ctx.bot.chat("Usage: goto <x> <y> <z>");
      return;
    }

    const x = parseFloat(ctx.args[0] as string);
    const y = parseFloat(ctx.args[1] as string);
    const z = parseFloat(ctx.args[2] as string);

    if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
      ctx.bot.chat("Invalid coordinates");
      return;
    }

    logger.info(`Moving to ${x}, ${y}, ${z}`);
    await ctx.bot.moveTo(x, y, z);
    ctx.bot.chat(`Moving to ${x}, ${y}, ${z}`);
  },
};

export const mineCommand = {
  metadata: {
    name: "mine",
    aliases: ["dig", "mineblock"],
    description: "Mine a specific block",
    usage: "mine <block_name>",
    arguments: ["block_name"],
    permissions: [],
  },
  execute: async (ctx: CommandContext) => {
    if (ctx.args.length === 0) {
      ctx.bot.chat("Usage: mine <block_name>");
      return;
    }

    const blockName = ctx.args[0] as string;
    logger.info(`Mining block: ${blockName}`);
    await ctx.bot.mineBlock(blockName);
    ctx.bot.chat(`Mining ${blockName}`);
  },
};

export const collectCommand = {
  metadata: {
    name: "collect",
    aliases: ["gather", "pickup"],
    description: "Collect items",
    usage: "collect <item>",
    arguments: ["item"],
    permissions: [],
  },
  execute: async (ctx: CommandContext) => {
    ctx.bot.chat("Collecting items...");
  },
};

export const attackCommand = {
  metadata: {
    name: "attack",
    aliases: ["fight", "pvp"],
    description: "Attack an entity",
    usage: "attack <entity>",
    arguments: ["entity"],
    permissions: [],
  },
  execute: async (ctx: CommandContext) => {
    if (ctx.args.length === 0) {
      ctx.bot.chat("Usage: attack <entity>");
      return;
    }

    const entityName = ctx.args[0] as string;
    const bot = ctx.bot.getMineflayerBot();
    if (!bot) {return;}

    const entities = Object.values(bot as Record<string, { name?: string }>);
    const entity = entities.find(
      (e) => e.name?.toLowerCase() === entityName.toLowerCase()
    );

    if (!entity) {
      ctx.bot.chat(`Entity ${entityName} not found`);
      return;
    }

    logger.info(`Attacking entity: ${entityName}`);
    await ctx.bot.attack(entity);
    ctx.bot.chat(`Attacking ${entityName}`);
  },
};

export const inventoryCommand = {
  metadata: {
    name: "inventory",
    aliases: ["inv", "items"],
    description: "Show inventory",
    usage: "inventory",
    arguments: [],
    permissions: [],
  },
  execute: async (ctx: CommandContext) => {
    const bot = ctx.bot.getMineflayerBot();
    if (!bot) {return;}

    const items = (bot as { inventory: { items: () => Array<{ name: string; count: number }> } }).inventory.items();
    if (items.length === 0) {
      ctx.bot.chat("Inventory is empty");
      return;
    }

    const itemList = items.map((i) => `${i.name} x${i.count}`).join(", ");
    ctx.bot.chat(`Inventory: ${itemList}`);
  },
};

export const sayCommand = {
  metadata: {
    name: "say",
    aliases: ["msg", "chat"],
    description: "Send a chat message",
    usage: "say <message>",
    arguments: ["message"],
    permissions: [],
  },
  execute: async (ctx: CommandContext) => {
    const message = ctx.args.join(" ");
    if (!message) {
      ctx.bot.chat("Usage: say <message>");
      return;
    }

    ctx.bot.chat(message);
  },
};

export const statusCommand = {
  metadata: {
    name: "status",
    aliases: ["info", "pos"],
    description: "Show bot status and surroundings",
    usage: "status",
    arguments: [],
    permissions: [],
  },
  execute: async (ctx: CommandContext) => {
    const mf = ctx.bot.getMineflayerBot();
    if (!mf) {return;}

    const entity = (mf as { entity?: { position: { x: number; y: number; z: number } } }).entity;
    const pos = entity?.position;
    const health = (mf as { health?: number }).health;
    const food = (mf as { food?: number }).food;
    const items = (mf as { inventory: { items: () => Array<{ name: string; count: number }> } }).inventory.items();

    const nearby = Object.values((mf as { entities: Record<string, { name?: string }> }).entities)
      .filter((e) => e.name && e.name !== (mf as { username: string }).username)
      .map((e) => e.name as string)
      .slice(0, 10);

    const status = [
      `Pos: ${pos ? `${pos.x}, ${pos.y}, ${pos.z}` : "unknown"}`,
      `Health: ${health ?? "?"} Food: ${food ?? "?"}`,
      `Inventory: ${items.length === 0 ? "empty" : items.map((i) => `${i.name} x${i.count}`).join(", ")}`,
      `Nearby: ${nearby.length === 0 ? "none" : nearby.join(", ")}`,
    ].join(" | ");

    ctx.bot.chat(status);
  },
};