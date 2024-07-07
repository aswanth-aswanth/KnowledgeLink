import path from "path";
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
import app from "./app"
import "../../../infra/messaging/rabbitmq/RabbitMQConnection";
import connectDB from "../../../infra/databases/mongoose/connection";


const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    console.log(`post-service connected to ${PORT}`);
    connectDB();
})
