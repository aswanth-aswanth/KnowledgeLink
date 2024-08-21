import path from "path";
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
import app from "./app";
import "../../../infra/messaging/rabbitmq/RabbitMQConnection";
import connectDB from "../../../infra/databases/mongoose/connection";
import http from 'http';
import { Server as SocketIOServer, Namespace } from 'socket.io';
import SocketService from '../../../infra/services/SocketService';

const PORT = process.env.PORT || 5005;

const server = http.createServer(app);

// const io = new SocketIOServer(server, {
//   cors: {
//     origin: 'https://knowledgelink.up.railway.app',
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//     credentials: true
//   }
// });

const io = new SocketIOServer(server, {
  path: '/socket.io',
  cors: {
    origin: '*',
    methods: ['GET', 'POST','PUT','PATCH','DELETE'],
    credentials: true,
  },
});

// const chatNamespace: Namespace = io.of('/chat');
SocketService.getInstance().setIO(io);

server.listen(PORT, () => {
  console.log(`chat-service connected to ${PORT}`);
  connectDB();
});

server.on('error', (error) => {
  console.error('Server error:', error);
});