import { CommandRegistry } from "./CommandRegistry";
import { RespValue } from "../protocol/types";

export class CommandDispatcher {
  constructor(private registry: CommandRegistry) {}

  async dispatch(rawCommand: string[]): Promise<RespValue> {
    const commandName = rawCommand[0];
    const command = this.registry.get(commandName);

    if (!command) {
      throw new Error(`unknown command: ${commandName}`);
    }

    return await command.execute({
      args: rawCommand.slice(1),
    });
  }
}
