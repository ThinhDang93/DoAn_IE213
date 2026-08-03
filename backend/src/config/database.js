import mongoose from "mongoose";

export const connectDatabase = async () => {
    const mongoUri =
        process.env.MONGO_URI || "mongodb://127.0.0.1:27017/doan_ie213";

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
};
