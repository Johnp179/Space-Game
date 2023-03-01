import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

async function dbConnect() {
  if (mongoose.connection.readyState) return;
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDb");
  } catch (e) {
    throw e;
  }
}

export default dbConnect;
