import { VeloxServer } from "@server/VeloxServer";
import { CommandDispatcher } from "@commands/runtime/CommandDispatcher";
import { registerCommands } from "@commands/runtime/utils";
import { CommandRegistry } from "@commands/runtime/CommandRegistry";
import { VeloxStore } from "@store/VeloxStore";
import { BlockingManager } from "@blocking/BlockingManager";
import { ServerContext } from "@server/ServerContext";
import { SERVER_PORT_NUMBER } from "@common/constants";

export const main = (): void => {
  const commandRegistry = new CommandRegistry();
  registerCommands(commandRegistry);

  const serverContext = new ServerContext({
    store: new VeloxStore(),
    blockingManager: new BlockingManager(),
  });
  const commandDispatcher = new CommandDispatcher(
    commandRegistry,
    serverContext,
  );

  const server = new VeloxServer(commandDispatcher);
  server.start(SERVER_PORT_NUMBER);
  process.on("SIGINT", (): void => {
    server.stop();
  });
};

main();
