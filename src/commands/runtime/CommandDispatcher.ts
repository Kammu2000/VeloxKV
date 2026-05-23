import { CommandRegistry } from "./CommandRegistry";
import { CommandType } from "./Command";
import { createRespError } from "@protocol/utils";
import { ClientSession } from "@client/ClientSession";
import { COMMANDS_ALLOWED_IN_SUBSCRIPTION_MODE } from "./constants";
import { RespType, RespValue } from "@protocol/types";
import { ServerContext } from "@server/ServerContext";

export class CommandDispatcher {
  constructor(
    private readonly registry: CommandRegistry,
    private readonly serverContext: ServerContext,
  ) {}

  async dispatch(
    rawCommand: string[],
    session: ClientSession,
  ): Promise<RespValue> {
    const commandName = rawCommand[0];

    // client connected
    if (commandName === CommandType.COMMAND) {
      return { type: RespType.NULL };
    }

    if (session.isInSubscriptionMode()) {
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
      session,
    });
  }
}
