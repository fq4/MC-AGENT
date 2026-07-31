import { CommandRegistry } from "./registry.js";
import { CommandExecutor } from "./registry.js";
import { Command } from "../types/index.js";
import {
  followCommand,
  stopCommand,
  gotoCommand,
  mineCommand,
  collectCommand,
  attackCommand,
  inventoryCommand,
  sayCommand,
  statusCommand,
} from "./commands.js";

export const commandRegistry = new CommandRegistry();
export { CommandExecutor };

export function registerCommands(): void {
  const commands: Command[] = [
    followCommand,
    stopCommand,
    gotoCommand,
    mineCommand,
    collectCommand,
    attackCommand,
    inventoryCommand,
    sayCommand,
    statusCommand,
  ];

  for (const command of commands) {
    commandRegistry.register(command);
  }
}