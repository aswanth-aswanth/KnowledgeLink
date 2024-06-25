import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
import app from "./app"
import connectDB from "../../../infra/databases/mongoose/connection";

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`auth-service connected to ${PORT}`);
    connectDB();
})
