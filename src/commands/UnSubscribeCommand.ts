import { Command, CommandContext } from "./runtime/Command";
import {
  createRespArray,
  createRespInteger,
  createRespBulkString,
} from "@protocol/utils";
import { CLIENT_CONNECTION_MODE } from "@client/constants";
import { RespArray } from "@protocol/types";

const unSubscribeAck = (
  channelName: string,
  totalSubscription: number,
): RespArray => {
  return createRespArray([
    createRespBulkString("unsubscribe"),
    createRespBulkString(channelName),
    createRespInteger(String(totalSubscription)),
  ]);
};

export class UnSubscribeCommand implements Command {
  async execute(ctx: CommandContext): Promise<void> {
    const { args, server, client } = ctx;

    for (const channelName of args) {
      const { subscriptions: clientSubscriptions } = client.session;

      const subscriptionToken = clientSubscriptions.get(channelName);

      if (subscriptionToken) {
        server.pubsubManager.unsubscribe(channelName, subscriptionToken);
        clientSubscriptions.remove(channelName);
      }

      if (clientSubscriptions.totalSubscription() === 0) {
        client.session.setClientMode(CLIENT_CONNECTION_MODE.NORMAL);
      }

      client.respWriter.write(
        unSubscribeAck(channelName, clientSubscriptions.totalSubscription()),
      );
    }
  }
}
