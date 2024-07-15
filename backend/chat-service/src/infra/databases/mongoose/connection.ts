import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chat');
        console.log("Mongodb connected");
    } catch (error) {
        console.log("Error connecting to mongodb...", error);
        process.exit(1);
    }
}

export default connectDB;