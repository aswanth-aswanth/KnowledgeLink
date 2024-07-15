// src/presentation/express/settings/server.ts

import path from "path";
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
import app from "./app"
import "../../../infra/messaging/rabbitmq/RabbitMQConnection";
import connectDB from "../../../infra/databases/mongoose/connection";
import SocketIOService from '../../../infra/services/SocketIOService';
import { createServer } from 'http';

const PORT = process.env.PORT || 5005;
const httpServer = createServer(app);

const socketIOService = new SocketIOService(httpServer);

httpServer.listen(PORT, () => { 
    console.log(`chat-service connected to ${PORT}`);
    connectDB();
});