import { Socket } from "net";
import logger from "@common/utils/logger";
import RespParser from "@protocol/parser";
import { CommandDispatcher } from "@commands/runtime/CommandDispatcher";
import { ClientSession } from "./ClientSession";
import { ClientRespWriter } from "./ClientRespWriter";
import { createRespError } from "@protocol/utils";
import { RespValue } from "@protocol/types";

// transport layer
export class ClientConnection {
  private closed: boolean = false;
  private readonly socket: Socket;
  private readonly respParser: RespParser;
  private readonly session: ClientSession;
  private readonly respWriter: ClientRespWriter;

  constructor(
    socket: Socket,
    private readonly commandDispatcher: CommandDispatcher,
    private readonly onClose: (connection: ClientConnection) => void,
  ) {
    this.socket = socket;
    this.respParser = new RespParser({
      returnReply: this.handleReply.bind(this),
      returnError: this.handleError.bind(this),
    });
    this.respWriter = new ClientRespWriter(this.socket);
    this.session = new ClientSession();
  }

  close(): void {
    if (this.closed) {
      return;
    }

    this.closed = true;
    this.session.close();
    this.socket.destroy();
    this.onClose(this);
  }

  start(): void {
    this.socket.setKeepAlive(true);
    this.socket.setNoDelay(true);

    this.socket.on("data", (chunk: Buffer): void => {
      this.respParser.execute(chunk);
    });

    this.socket.on("close", (): void => {
      this.close();
    });

    this.socket.on("error", (err: Error): void => {
      logger.error(err);
      this.close();
    });
  }

  private handleReply(reply: string[]): void {
    const client = {
      session: this.session,
      respWriter: this.respWriter,
    };

    this.commandDispatcher
      .dispatch(reply, client)
      .then((result: RespValue | void): void => {
        if (result) {
          this.respWriter.write(result);
        }
      })
      .catch((err: Error): void => {
        this.handleError(err);
      });
  }

  private handleError(err: Error): void {
    const respError = createRespError(err.message);
    this.respWriter.write(respError);
  }
}
