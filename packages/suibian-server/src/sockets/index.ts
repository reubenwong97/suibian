import express from "express";
import socketio from "socket.io";
import { joinRoom, createRoom, closeRoom, startRoom } from "./helper/room";
import {
  suibianSocket,
  joinRoomPayload,
  roomPayloadBase,
  createRoomPayload,
  startRoomPayload,
  votePayload
} from "@suibian/commons";
import { createUser } from "./helper/user";
import { broadcastRoom } from "./helper/messaging";
import { submitVote } from "./helper/vote";
const http = require("http");

export default {
  startSocketServer: function (app: express.Router) {
    const httpServer = http.Server(app);
    const io = socketio.listen(httpServer);

    io.on("connection", (socket: suibianSocket) => {
      console.log(`socket ${socket.id} connected`);

      socket.on("disconnect", () =>
        console.log(`socket ${socket.id} disconnected`)
      );

      socket.on("joinRoom", async (data: joinRoomPayload) => {
        await createUser(data);
        await joinRoom(socket, io, data);
      });

      socket.on("closeRoom", (data: roomPayloadBase) => {
        const { roomCode } = data;
        closeRoom(io, socket, roomCode);
      });

      socket.on("submitVote", async (data: votePayload) => {
        const roomCode = data.roomCode;
        const votes = await submitVote(io, socket, data);
        broadcastRoom(io, { roomCode, payload: votes }, "submitVote");
      });

      socket.on("createRoom", async (data: createRoomPayload) => {
        //first user creates a room and also joins the room
        let { username, isOwner } = data.user;
        const position = data.position;
        //set isOwner to true
        isOwner = true;
        const roomCode = await createRoom(socket, position);
        if (roomCode) {
          const roomPayload = {
            roomCode,
            user: {
              username,
              isOwner
            }
          };
          await createUser({
            roomCode,
            ...data
          });
          await joinRoom(socket, io, roomPayload);
        }
      });

      socket.on("startRoom", async (data: startRoomPayload) => {
        const { roomCode } = data;
        const foodArray = await startRoom(io, roomCode);
        broadcastRoom(io, { roomCode, payload: foodArray }, "startRoom");
        console.log("emitted food aray", foodArray);
        console.log("emitted start rooom event to user");
      });

      socket.on("getRoomInfo", (data: roomPayloadBase) => { });
    });

    return httpServer;
  }
};
