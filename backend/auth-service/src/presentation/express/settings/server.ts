import app from "./app"
import connectDB from "../../../infra/databases/mongoose/connection";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`auth-service connected to ${PORT}`);
    connectDB();
})