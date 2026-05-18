import { VeloxStore } from "../../store/VeloxStore";
import { ClientConnection } from "../../server/connections/ClientConnection";
import { RespValue } from "../../protocol/types";

export interface CommandContext {
  args: string[];
  store: VeloxStore;
  connection: ClientConnection;
}

export interface Command {
  execute(ctx: CommandContext): Promise<RespValue>;
}

export enum CommandType {
  PING = "PING",
  ECHO = "ECHO",
  GET = "GET",
  SET = "SET",
  DEL = "DEL",
  EXISTS = "EXISTS",
  LPUSH = "LPUSH",
  RPUSH = "RPUSH",
  LPOP = "LPOP",
  RPOP = "RPOP",
  LLEN = "LLEN",
  LINDEX = "LINDEX",
  LRANGE = "LRANGE",
  BLPOP = "BLPOP",
}
