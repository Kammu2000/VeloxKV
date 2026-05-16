import { CommandRegistry } from "./CommandRegistry";
import { VeloxStore } from "../../store/VeloxStore";
import { createRespError } from "../../protocol/utils";
import { RespType, RespValue } from "../../protocol/types";

export class CommandDispatcher {
  constructor(
    private registry: CommandRegistry,
    private store: VeloxStore,
  ) {}

  async dispatch(rawCommand: string[]): Promise<RespValue> {
    const commandName = rawCommand[0];

    // client connected
    if (commandName === "COMMAND") {
      return { type: RespType.NULL };
    }

    const command = this.registry.get(commandName);

    if (!command) {
      return createRespError(`unknown command: ${commandName}`);
    }

    return await command.execute({
      args: rawCommand.slice(1),
      store: this.store,
    });
  }
}
