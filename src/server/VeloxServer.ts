import net, { Server, Socket } from "net";
import logger from "@common/utils/logger";
import { CommandDispatcher } from "@commands/runtime/CommandDispatcher";
import { ClientConnection } from "@client/ClientConnection";

export class VeloxServer {
  private readonly server: Server;
  private readonly connections = new Set<ClientConnection>();

  constructor(private readonly commandDispatcher: CommandDispatcher) {
    this.server = net.createServer(this.handleConnection.bind(this));
  }

  private handleConnection(socket: Socket): void {
    const connection = new ClientConnection(
      socket,
      this.commandDispatcher,
      this.handleDisconnect.bind(this),
    );

    this.connections.add(connection);
    connection.start();
    logger.log("Client connected");
  }

  private handleDisconnect(connection: ClientConnection): void {
    this.connections.delete(connection);
    logger.log("Client disconnected");
  }

  start(port: number): void {
    this.server.listen(port, () => {
      logger.log(`Server listening on ${port}`);
    });
  }

  stop(): void {
    logger.log("Stopping server");

    for (const connection of this.connections) {
      connection.close();
    }

    this.server.close((): void => {
      logger.log("Server stopped");
    });
  }
}
