import { CommandType } from "./Command";

export const COMMANDS_ALLOWED_IN_SUBSCRIPTION_MODE = new Set<string>([
  CommandType.SUBSCRIBE,
  CommandType.PING,
  CommandType.UNSUBSCRIBE,
]);
