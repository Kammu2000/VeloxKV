import { Channel } from "./Channel";
import { SubscriptionToken } from "./SubscriptionToken";
import { ClientRespWriter } from "@client/ClientRespWriter";

export class PubSubManager {
  private channels = new Map<string, Channel>();

  createChannel(channelName: string): Channel {
    const newChannel = new Channel(channelName);
    this.channels.set(channelName, newChannel);
    return newChannel;
  }

  removeChannel(channelName: string): void {
    if (this.channels.has(channelName)) {
      this.channels.delete(channelName);
    }
  }

  getChannel(channelName: string): Channel | undefined {
    return this.channels.get(channelName);
  }

  subscribe(
    channelName: string,
    respWriter: ClientRespWriter,
  ): SubscriptionToken {
    let channel = this.getChannel(channelName);

    if (!channel) {
      channel = this.createChannel(channelName);
    }
    return channel.addSubscriber(respWriter);
  }

  publish(channelName: string, message: string): number {
    return this.getChannel(channelName)?.publish(message) ?? 0;
  }

  unsubscribe(channelName: string, token: SubscriptionToken): void {
    token.dispose();
    const channel = this.getChannel(channelName);

    if (channel && channel.size() === 0) {
      this.removeChannel(channelName);
    }
  }

  totalSubscribers(channelName: string): number {
    return this.getChannel(channelName)?.size() ?? 0;
  }
}
