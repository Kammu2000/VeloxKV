import { Command } from "./types";

export class CommandRegistry {
  private commands = new Map<string, Command>();

  register(name: string, command: Command): void {
    this.commands.set(name.toUpperCase(), command);
  }

  get(name: string): Command | undefined {
    return this.commands.get(name.toUpperCase());
  }
}
