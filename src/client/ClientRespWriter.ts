import { Socket } from "net";
import { RespSerializer } from "@protocol/serializer";
import { RespValue, RespWriter } from "@protocol/types";

export class ClientRespWriter implements RespWriter {
  private readonly respSerializer: RespSerializer;

  constructor(private readonly socket: Socket) {
    this.respSerializer = new RespSerializer();
  }

  public write(value: RespValue): void {
    const serializedValue = this.respSerializer.serialize(value);
    this.socket.write(serializedValue);
  }
}
