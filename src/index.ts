import { RedisServer } from "./server/RedisServer";
import { SERVER_PORT_NUMBER } from "./common/constants";

export const main = (): void => {
  const server = new RedisServer();
  server.start(SERVER_PORT_NUMBER);
  process.on("SIGINT", (): void => {
    server.stop();
  });
};

main();
