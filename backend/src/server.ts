// src/server.ts
import app from "./app";
import validateEnv from './util/validateEnv';
import mongoose from "mongoose";

const env = validateEnv();

const port = env.PORT;

const mongoConnectionString: string = env.MONGO_CONNECTION_STRING as string;

mongoose.connect(mongoConnectionString).then(() => {
  console.log("Mongoose connected");
  app.listen(port, () => {
    console.log("Server running on port: " + port);
  });
})
.catch(console.error);