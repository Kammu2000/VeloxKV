import { CommandType } from "./Command";
import { CommandRegistry } from "./CommandRegistry";
import { PingCommand } from "../PingCommand";

export const registerCommands = (registry: CommandRegistry): void => {
  registry.register(CommandType.PING, new PingCommand());
};
