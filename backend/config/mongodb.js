import mongoose from "mongoose";

function buildMongoUri() {
  if (process.env.MONGODB_URI && process.env.MONGODB_URI.trim() !== '') {
    return process.env.MONGODB_URI.trim();
  }

  const user = process.env.MONGO_USERNAME;
  const pass = process.env.MONGO_PASSWORD;
  const host = process.env.MONGO_HOST || '127.0.0.1';
  const port = process.env.MONGO_PORT || '27017';
  const db   = process.env.MONGO_DB   || 'ecommerce';
  const authSource = process.env.MONGO_AUTHSOURCE || (user ? 'admin' : undefined);

  const credentials = user && pass ? `${encodeURIComponent(user)}:${encodeURIComponent(pass)}@` : '';
  const qs = authSource ? `?authSource=${encodeURIComponent(authSource)}` : '';
  return `mongodb://${credentials}${host}:${port}/${db}${qs}`;
}

async function connectWithRetry(uri, maxAttempts = 5) {
  let attempt = 0;
  let lastError = null;
  while (attempt < maxAttempts) {
    attempt++;
    try {
      console.log(`MongoDB connection attempt ${attempt}/${maxAttempts}`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        maxPoolSize: 10,
      });
      return;
    } catch (err) {
      lastError = err;
      const backoff = Math.min(5000, attempt * 1000);
      console.warn(`MongoDB connect failed: ${err.message}. Retrying in ${backoff}ms...`);
      await new Promise(r => setTimeout(r, backoff));
    }
  }
  throw lastError;
}

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("DB Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.log("DB Connection Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("DB Disconnected");
    });

    const mongoUri = buildMongoUri();
    console.log("Connecting to MongoDB:", mongoUri.replace(/\/\/.+@/, "//***@"));

    await connectWithRetry(mongoUri);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.log("MongoDB not available, running without database...");
    console.log("Error:", error.message);
  }
}

export default connectDB;


