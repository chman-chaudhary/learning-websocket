import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const clients = new Map();

wss.on("connection", async (ws, req) => {
  console.log("New connection");
  ws.on("message", (message: any) => {
    const data = JSON.parse(message);
    if (data.type === "register") {
      clients.set(data.userId, ws);
      console.log("Registering client: ", data.userId);
    } else if (data.type === "message") {
      const recieverSocket = clients.get(data.receiver);
      if (recieverSocket && recieverSocket.readyState === ws.OPEN) {
        recieverSocket.send(JSON.stringify(data));
      } else {
        console.log(`Client ${data.recieverId} is not connected`);
      }
    }
  });
});

server.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
