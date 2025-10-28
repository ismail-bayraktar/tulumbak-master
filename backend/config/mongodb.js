import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("DB Connected");
        })

        mongoose.connection.on("error", (err) => {
            console.log("DB Connection Error:", err);
        })

        mongoose.connection.on("disconnected", () => {
            console.log("DB Disconnected");
        })

        const baseUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
        const hasDbInUri = /\/(\w|%|-)+$/.test(baseUri);
        const mongoUri = hasDbInUri ? baseUri : `${baseUri}/ecommerce`;

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000, // 30 saniye
            connectTimeoutMS: 30000, // 30 saniye
            maxPoolSize: 10, // Maksimum bağlantı
        })
    } catch (error) {
        console.log("MongoDB not available, running without database...");
        console.log("Error:", error.message);
    }
}

export default connectDB;
