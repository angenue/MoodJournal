// src/server.ts
import mongoose from "mongoose";

const connectionString = process.env.NODE_ENV === 'test'
  ? process.env.MONGO_CONNECTION_STRING_TEST!
  : process.env.MONGO_CONNECTION_STRING!;

  mongoose.connect(connectionString)
  .then(() => {
    console.log(`Connected to MongoDB at ${connectionString}`);
    console.log(`Current DB: ${mongoose.connection.db.databaseName}`); // This should log 'moodjournal_test'
  })
  .catch(err => console.error(err));