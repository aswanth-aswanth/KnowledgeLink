import path from "path";
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
import app from "./app"
import "../../../infra/messaging/rabbitmq/RabbitMQConnection";
import connectDB from "../../../infra/databases/mongoose/connection";
import logger from '../../../infra/logging/logger';


const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    logger.info(`profile-service connected to port ${PORT}`);
    connectDB();
})
