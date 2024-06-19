import app from "./app"
import '../../../infra/messaging/rabbitmq';
import connectDB from "../../../infra/databases/mongoose/connection";

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`auth-service connected to ${PORT}`);
    connectDB();
})
