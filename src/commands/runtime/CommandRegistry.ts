import { Command } from "./Command";

export class CommandRegistry {
  private commands = new Map<string, Command>();

  register(name: string, command: Command): void {
    this.commands.set(name, command);
  }

  get(name: string): Command | undefined {
    return this.commands.get(name);
  }
}
