import path from "path";
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
import app from "./app";
import connectDB from "../../../infra/databases/mongoose/connection";
import "../../../infra/messaging/rabbitmq/RabbitMQConnection";

dotenv.config();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Roadmap service connected to ${PORT}`);
    connectDB();
})

