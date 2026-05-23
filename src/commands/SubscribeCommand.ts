import {
  createRespArray,
  createRespBulkString,
  createRespInteger,
} from "@protocol/utils";
import { Command, CommandContext } from "./runtime/Command";
import { CLIENT_CONNECTION_MODE } from "@client/constants";
import { RespArray } from "@protocol/types";

const subscribeAck = (
  channelName: string,
  totalSubscription: number,
): RespArray => {
  return createRespArray([
    createRespBulkString("subscribe"),
    createRespBulkString(channelName),
    createRespInteger(String(totalSubscription)),
  ]);
};

export class SubscribeCommand implements Command {
  async execute(ctx: CommandContext): Promise<void> {
    const { args, server, client } = ctx;

    if (client.session.isInNormalMode()) {
      client.session.setClientMode(CLIENT_CONNECTION_MODE.SUBSCRIPTION);
    }

    for (const channelName of args) {
      const { subscriptions: clientSubscriptions } = client.session;

      if (!clientSubscriptions.has(channelName)) {
        const subscriptionToken = server.pubsubManager.subscribe(
          channelName,
          client.respWriter,
        );
        clientSubscriptions.add(channelName, subscriptionToken);
      }

      client.respWriter.write(
        subscribeAck(channelName, clientSubscriptions.totalSubscription()),
      );
    }
  }
}
