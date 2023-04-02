import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
async function connect() {
  const mongodb = await MongoMemoryServer.create();
  const mongoUri = mongodb.getUri();

  const db = await mongoose.connect(mongoUri);
  console.log("Database connected successfully");
  return db;
}

export default connect;
