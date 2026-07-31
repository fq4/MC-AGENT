import { Command, CommandContext } from "../types/index.js";

export class CommandRegistry {
  private commands: Map<string, Command> = new Map();

  register(command: Command): void {
    const name = command.metadata.name;
    if (this.commands.has(name)) {
      throw new Error(`Command ${name} is already registered`);
    }

    this.commands.set(name, command);

    for (const alias of command.metadata.aliases) {
      if (this.commands.has(alias)) {
        throw new Error(`Alias ${alias} conflicts with existing command`);
      }
      this.commands.set(alias, command);
    }
  }

  get(name: string): Command | undefined {
    return this.commands.get(name);
  }

  getAll(): Command[] {
    const seen = new Set<string>();
    const result: Command[] = [];

    for (const command of this.commands.values()) {
      if (!seen.has(command.metadata.name)) {
        seen.add(command.metadata.name);
        result.push(command);
      }
    }

    return result;
  }

  has(name: string): boolean {
    return this.commands.has(name);
  }

  clear(): void {
    this.commands.clear();
  }
}

export class CommandExecutor {
  constructor(private _registry: CommandRegistry) {}

  async execute(commandName: string, ctx: CommandContext): Promise<boolean> {
    const command = this._registry.get(commandName);
    if (!command) {
      return false;
    }

    try {
      await command.execute(ctx);
      return true;
    } catch (error) {
      console.error(`Command ${commandName} failed:`, error);
      return false;
    }
  }
}