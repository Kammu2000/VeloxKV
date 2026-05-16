import { CommandRegistry } from "./CommandRegistry";
import { PingCommand } from "../PingCommand";
import { EchoCommand } from "../EchoCommand";
import { GetCommand } from "../GetCommand";
import { SetCommand } from "../SetCommand";
import { DelCommand } from "../DelCommand";
import { ExistsCommand } from "../ExistsCommand";
import { CommandType } from "./Command";

export const registerCommands = (registry: CommandRegistry): void => {
  registry.register(CommandType.PING, new PingCommand());
  registry.register(CommandType.ECHO, new EchoCommand());
  registry.register(CommandType.GET, new GetCommand());
  registry.register(CommandType.SET, new SetCommand());
  registry.register(CommandType.DEL, new DelCommand());
  registry.register(CommandType.EXISTS, new ExistsCommand());
};
