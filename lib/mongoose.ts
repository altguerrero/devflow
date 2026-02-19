import "server-only";
import mongoose, { Mongoose } from "mongoose";
import logger from "@/lib/logger";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME ?? "devflow";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn) {
    logger.debug("Reusing existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    logger.info({ dbName: MONGODB_DB_NAME }, "Connecting to MongoDB");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: MONGODB_DB_NAME,
      })
      .then((result) => {
        logger.info("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        cached.promise = null;
        logger.error({ err: error }, "Error connecting to MongoDB");
        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

export default dbConnect;
