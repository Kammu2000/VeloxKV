import net, { Server, Socket } from "net";
import Parser from "redis-parser";
import { RedisError } from "redis-errors";
import logger from "../common/helpers/logger";

export class RedisServer {
  private server: Server;
  private sockets: Set<Socket>;

  constructor() {
    this.sockets = new Set();

    this.server = net.createServer((socket: Socket): void => {
      this.sockets.add(socket);
      logger.log("Client connected");

      socket.on("data", (data: Buffer): void => {
        const parser = new Parser({
          returnReply(reply: any): void {
            logger.log(reply);
          },
          returnError(err: RedisError): void {
            logger.error(err);
          },
        });

        parser.execute(data);
        socket.write("+PONG\r\n");
      });

      socket.on("end", (): void => {
        logger.log("Client disconnected");
      });

      socket.setKeepAlive(true);
      socket.setNoDelay(true);
    });
  }

  public start(port: number): void {
    this.server.listen(port, (): void => {
      logger.log("Server is listening on port 6379");
    });
  }

  public stop(): void {
    logger.log("Shutting down server");

    for (const socket of this.sockets) {
      socket.destroy();
    }

    this.server.close((): void => {
      logger.log("Server stopped");
    });
  }
}
