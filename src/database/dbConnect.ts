import mongoose from "mongoose";

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? globalThis.__MONGO_URI__
    : process.env.MONGODB_ATLAS_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

export async function connectDB() {
  if (mongoose.connection.readyState) return;
  await mongoose.connect(MONGODB_URI!);
  console.log(`Connected to mongoDb`);
}

export async function disconnectDB() {
  await mongoose.connection.close();
}
