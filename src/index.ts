import { VeloxServer } from "./server/VeloxServer";
import { SERVER_PORT_NUMBER } from "./common/constants";

export const main = (): void => {
  const server = new VeloxServer();
  server.start(SERVER_PORT_NUMBER);
  process.on("SIGINT", (): void => {
    server.stop();
  });
};

main();
