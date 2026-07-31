import { config } from "./config/index.js";
import { Bot } from "./bot/index.js";
import { registerCommands } from "./commands/index.js";
import { registerBehaviors } from "./behaviors/index.js";
import { eventManager } from "./events/index.js";

async function main(): Promise<void> {
  const bot = new Bot(config);

  registerCommands();
  registerBehaviors();

  eventManager.on("bot:login", () => {
    console.log("Bot logged in successfully");
  });

  eventManager.on("bot:spawn", () => {
    console.log("Bot spawned - starting autonomous behavior");
    bot.chat("mc-agent online. Type !help for commands.");
    wanderAround(bot);
    setInterval(() => {
      if (!bot.isReady) {return;}
      const mf = bot.getMineflayerBot();
      if (!mf) {return;}
      const entity = (mf as { entity?: { position: { x: number; y: number; z: number } } }).entity;
      const pos = entity?.position;
      const health = (mf as { health?: number }).health;
      const food = (mf as { food?: number }).food;
      const nearby = Object.values((mf as { entities: Record<string, { name?: string }> }).entities).filter((e) => e.name && e.name !== mf.username);
      console.log(`[status] pos=${pos ? `${pos.x},${pos.y},${pos.z}` : "?"} hp=${health ?? "?"} food=${food ?? "?"} nearby=${nearby.length}`);
    }, 30000);

    if (config.serverPassword) {
      setTimeout(() => {
        if (!bot.isReady) {return;}
        console.log("[auth] Sending delayed /register as fallback");
        bot.chat(`/register ${config.serverPassword}`);
      }, 3000);
    }
  });

  const wanderAround = async (bot: Bot) => {
    const directions = [
      { x: 0, y: 64, z: 10 },
      { x: 10, y: 64, z: 0 },
      { x: 0, y: 64, z: -10 },
      { x: -10, y: 64, z: 0 },
    ];
    let i = 0;
    while (bot.isReady) {
      try {
        const dest = directions[i % directions.length]!;
        console.log(`[auto] Walking to ${dest.x}, ${dest.y}, ${dest.z}`);
        await bot.moveTo(dest.x, dest.y, dest.z);
        console.log(`[auto] Arrived at ${dest.x}, ${dest.y}, ${dest.z}`);
        await new Promise((r) => setTimeout(r, 5000));
        i++;
      } catch {
        console.log("[auto] Wander interrupted, retrying...");
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  };

  eventManager.on("bot:chat", ({ sender, message }) => {
    console.log(`[chat] <${sender}> ${message}`);

    const lowerMessage = message.toLowerCase().trim();

    if (config.serverPassword) {
      const lower = lowerMessage;
      if (lower.includes("register") || lower.includes("login") || lower.includes("logged in")) {
        const username = config.username;
        const password = config.serverPassword;
        if (lower.includes("register")) {
          bot.chat(`/register ${password}`);
          console.log("[auth] Auto-registering...");
        } else if (lower.includes("login")) {
          bot.chat(`/login ${username} ${password}`);
          console.log("[auth] Auto-logging in...");
        }
        return;
      }
    }

    const commandName = lowerMessage.startsWith("!") ? lowerMessage.slice(1) : lowerMessage;

    if (bot.commands.has(commandName)) {
      const args = message.split(" ");
      const senderName = args.shift() || sender;

      bot.commandExecutor.execute(commandName, {
        bot,
        args,
        sender: senderName,
      }).catch((error: unknown) => {
        console.error(`Failed to execute command ${commandName}:`, error);
      });
    }
  });

  eventManager.on("bot:error", ({ error }) => {
    console.error("Bot error:", error);
  });

  process.on("SIGINT", async () => {
    console.log("Shutting down...");
    await bot.disconnect();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("Shutting down...");
    await bot.disconnect();
    process.exit(0);
  });

  try {
    await bot.connect();
  } catch (error) {
    console.error("Failed to start bot:", error);
    process.exit(1);
  }
}

main();