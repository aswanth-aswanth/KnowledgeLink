import app from "./app"
import "../../../infra/messaging/rabbitmq/RabbitMQConnection";
import connectDB from "../../../infra/databases/mongoose/connection";

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`profile-service connected to ${PORT}`);
    connectDB();
})
