// types.d.ts (or you can name it global.d.ts)
import mongoose from "mongoose";

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// This line ensures the file is treated as a module
export {};
