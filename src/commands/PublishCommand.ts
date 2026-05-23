import { Command, CommandContext } from "./runtime/Command";
import { createRespInteger } from "@protocol/utils";
import { RespValue } from "@protocol/types";

export class PublishCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, server } = ctx;
    const [channelName, message] = args;

    const subscribersCount = server.pubsubManager.publish(channelName, message);
    return createRespInteger(String(subscribersCount));
  }
}
