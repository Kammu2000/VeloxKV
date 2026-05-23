import { createRespArray, createRespBulkString } from "@protocol/utils";
import { ClientRespWriter } from "@client/ClientRespWriter";
import { Channel } from "./Channel";
import { RespArray } from "@protocol/types";

const createRespMessage = (channelName: string, message: string): RespArray => {
  return createRespArray([
    createRespBulkString("message"),
    createRespBulkString(channelName),
    createRespBulkString(message),
  ]);
};

export class SubscriptionToken {
  constructor(
    private readonly channel: Channel,
    private readonly respWriter: ClientRespWriter,
  ) {}

  notify(message: string): void {
    this.respWriter.write(createRespMessage(this.channel.name, message));
  }

  dispose(): void {
    this.channel.removeSubscriber(this);
  }
}
