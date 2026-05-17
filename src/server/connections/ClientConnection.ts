import { Socket } from "net";
import Parser from "redis-parser";
import { RedisError as VeloxError } from "redis-errors";
import { CommandDispatcher } from "../../commands/runtime/CommandDispatcher";
import { RespSerializer } from "../../protocol/serializer";
import { BlockedOperation } from "./utils/BlockedOperation";
import logger from "../../common/utils/logger";
import { RespError, RespType, RespValue } from "../../protocol/types";

export class ClientConnection {
  private readonly parser: Parser;
  private closed: boolean = false;
  private blockedOperation?: BlockedOperation;

  constructor(
    private readonly socket: Socket,
    private readonly commandDispatcher: CommandDispatcher,
    private readonly respSerializer: RespSerializer,
    private readonly onClose: (connection: ClientConnection) => void,
  ) {
    this.parser = this.createParser();
  }

  start(): void {
    this.socket.setKeepAlive(true);
    this.socket.setNoDelay(true);

    this.socket.on("data", (chunk: Buffer): void => {
      this.parser.execute(chunk);
    });

    this.socket.on("close", (): void => {
      this.close();
    });

    this.socket.on("error", (err: Error): void => {
      logger.error(err);
      this.close();
    });
  }

  close(): void {
    if (this.closed) {
      return;
    }

    this.closed = true;
    this.blockedOperation?.cancel();
    this.socket.destroy();
    this.onClose(this);
  }

  write(resp: RespValue): void {
    const serialized = this.respSerializer.serialize(resp);
    this.socket.write(serialized);
  }

  setBlockedOperation(operation: BlockedOperation): void {
    this.blockedOperation = operation;
  }

  private createParser(): Parser {
    return new Parser({
      returnReply: this.handleReply.bind(this),
      returnError: this.handleParserError.bind(this),
    });
  }

  private handleReply(reply: string[]): void {
    this.commandDispatcher
      .dispatch(reply, this)
      .then((result: RespValue): void => {
        this.write(result);
      })
      .catch((err: Error): void => {
        this.handleCommandError(err);
      });
  }

  private handleParserError(err: VeloxError): void {
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
