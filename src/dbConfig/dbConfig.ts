import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Augment global object with the mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  if (global.mongooseCache.conn) {
    return global.mongooseCache.conn;
  }

  if (!global.mongooseCache.promise) {
    global.mongooseCache.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
      console.log("MongoDB connected successfully");
      return mongooseInstance;
    });
  }

  try {
    global.mongooseCache.conn = await global.mongooseCache.promise;
  } catch (err) {
    global.mongooseCache.promise = null;
    console.error("MongoDB connection error:", err);
    throw err;
  }

  return global.mongooseCache.conn;
};

export default connectDB;
