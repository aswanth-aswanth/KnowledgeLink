import app from "./app";
import connectDB from "../../../infra/databases/mongoose/connection";
import "../../../infra/messaging/rabbitmq/RabbitMQConnection";
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Roadmap service connected to ${PORT}`);
    connectDB();
})

