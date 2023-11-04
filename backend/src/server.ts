// src/server.ts
import dotenv from 'dotenv';
import app from "./app";
import validateEnv from './util/validateEnv';
import mongoose from "mongoose";
dotenv.config(); 
const env = validateEnv();
const port = env.PORT;

let connectionString;

if (process.env.NODE_ENV === 'test') {
  connectionString = process.env.MONGO_CONNECTION_STRING_TEST;
} else {
  connectionString = process.env.MONGO_CONNECTION_STRING;
}

if (!connectionString) {
  throw new Error('Database connection string is not set.');
}
  mongoose.connect(connectionString)
  .then(() => {

    console.log("Mongoose connected");
  app.listen(port, () => {
    console.log("Server running on port: " + port);
  });
  
  })
  .catch(err => console.error(err));