import { Socket } from "net";
import logger from "@common/utils/logger";
import RespParser from "@protocol/parser";
import { RespSerializer } from "@protocol/serializer";
import { VeloxError } from "@protocol/parser";
import { RespError, RespValue, RespType } from "@protocol/types";
import { CommandDispatcher } from "@commands/runtime/CommandDispatcher";
import { ClientSession } from "./ClientSession";

// transport layer: contains protocol serializer, parser and connection start and end responsibilities
export class ClientConnection {
  private closed: boolean = false;
  private readonly socket: Socket;
  private readonly respParser: RespParser;
  private readonly respSerializer: RespSerializer;
  private readonly session: ClientSession;

  constructor(
    socket: Socket,
    private readonly commandDispatcher: CommandDispatcher,
    private readonly onClose: (connection: ClientConnection) => void,
  ) {
    this.socket = socket;
    this.respParser = this.createRespParser();
    this.respSerializer = new RespSerializer();
    this.session = new ClientSession();
  }

  close(): void {
    if (this.closed) {
      return;
    }

    this.closed = true;
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

  write(resp: RespValue): void {
    const serialized = this.respSerializer.serialize(resp);
    this.socket.write(serialized);
  }

  private createRespParser(): RespParser {
    return new RespParser({
      returnReply: this.handleReply.bind(this),
      returnError: this.handleRespParserError.bind(this),
    });
  }

  private handleReply(reply: string[]): void {
    this.commandDispatcher
      .dispatch(reply, this.session)
      .then((result: RespValue): void => {
        this.write(result);
      })
      .catch((err: Error): void => {
        this.handleCommandError(err);
      });
  }

  private handleRespParserError(err: VeloxError): void {
    const respError: RespError = {
      type: RespType.ERROR,
      value: err.message,
    };

    this.write(respError);
  }

  private handleCommandError(err: Error): void {
    const respError: RespError = {
      type: RespType.ERROR,
      value: err.message,
    };

    this.write(respError);
  }
}
