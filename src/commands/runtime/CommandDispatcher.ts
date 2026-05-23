import { CommandRegistry } from "./CommandRegistry";
import { CommandContext, CommandType } from "./Command";
import { createRespError } from "@protocol/utils";
import { COMMANDS_ALLOWED_IN_SUBSCRIPTION_MODE } from "./constants";
import { ServerContext } from "@server/ServerContext";
import { RespType, RespValue } from "@protocol/types";

export class CommandDispatcher {
  constructor(
    private readonly registry: CommandRegistry,
    private readonly serverContext: ServerContext,
  ) {}

  async dispatch(
    rawCommand: string[],
    client: CommandContext["client"],
  ): Promise<RespValue | void> {
    const commandName = rawCommand[0].toUpperCase();

    // client connected
    if (commandName === CommandType.COMMAND) {
      return { type: RespType.NULL };
    }

    if (client.session.isInSubscriptionMode()) {
      if (!COMMANDS_ALLOWED_IN_SUBSCRIPTION_MODE.has(commandName)) {
        return createRespError(
          `Can't execute ${commandName}: only (P|S)SUBSCRIBE / (P|S)UNSUBSCRIBE / PING are allowed in this context`,
        );
      }
    }

    const command = this.registry.get(commandName);

    if (!command) {
      return createRespError(`unknown command: ${commandName}`);
    }

    return await command.execute({
      args: rawCommand.slice(1),
      server: this.serverContext,
      client,
    });
  }
}
