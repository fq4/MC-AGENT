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
    const lowerMessage = message.toLowerCase().trim();
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