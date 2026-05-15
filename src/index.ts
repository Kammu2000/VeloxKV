import { VeloxServer } from "./server/VeloxServer";
import { CommandDispatcher } from "./commands/runtime/CommandDispatcher";
import { SERVER_PORT_NUMBER } from "./common/constants";
import { registerCommands } from "./commands/runtime/utils";
import { CommandRegistry } from "./commands/runtime/CommandRegistry";
import { RespSerializer } from "./protocol/serializer";

export const main = (): void => {
  const commandRegistry = new CommandRegistry();
  registerCommands(commandRegistry);
  const commandDispatcher = new CommandDispatcher(commandRegistry);
  const respSerializer = new RespSerializer();

  const server = new VeloxServer(commandDispatcher, respSerializer);
  server.start(SERVER_PORT_NUMBER);
  process.on("SIGINT", (): void => {
    server.stop();
  });
};

main();
