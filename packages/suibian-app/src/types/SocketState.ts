//creating socket
import { socketCommands } from "@suibian/commons";

export type SocketState = {
  endpoint: string;
  socket: SuibianSocket | null;
  username: string;
  roomCode: number;
};

export interface SuibianSocket extends SocketIOClient.Socket {
  emit(event: socketCommands, data: any): SocketIOClient.Socket;
}