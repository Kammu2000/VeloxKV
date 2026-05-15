import net, { Server, Socket } from "net";
import Parser from "redis-parser";
import { RedisError as VeloxError } from "redis-errors";
import logger from "../common/helpers/logger";
import { CommandDispatcher } from "../commands/runtime/CommandDispatcher";
import { RespSerializer } from "../protocol/serializer";
import { RespError, RespType, RespValue } from "../protocol/types";

export class VeloxServer {
  private server: Server;
  private sockets: Set<Socket>;
  private commandDispatcher: CommandDispatcher;
  private respSerializer: RespSerializer;

  constructor(
    commandDispatcher: CommandDispatcher,
    respSerializer: RespSerializer,
  ) {
    this.sockets = new Set();
    this.commandDispatcher = commandDispatcher;
    this.respSerializer = respSerializer;
    this.server = net.createServer(this.handleConnection.bind(this));
  }

  private handleConnection(socket: Socket): void {
    this.sockets.add(socket);
    logger.log("Client connected");

    socket.setKeepAlive(true);
    socket.setNoDelay(true);

    const parser = this.createParser(socket);
    socket.on("data", (chunk: Buffer): void => parser.execute(chunk));

    socket.on("end", (): void => {
      logger.log("Client disconnected");
    });
  }

  private createParser(socket: Socket): Parser {
    const handleClientReply = (reply: any): void => {
      this.commandDispatcher.dispatch(reply).then((result: RespValue): void => {
        const respResult = this.respSerializer.serialize(result);
        socket.write(respResult);
      });
    };

    const handleClientError = (err: VeloxError): void => {
      const respError: RespError = {
        type: RespType.ERROR,
        value: err.message,
      };

      this.respSerializer.serialize(respError);
    };

    return new Parser({
      returnReply: handleClientReply,
      returnError: handleClientError,
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
