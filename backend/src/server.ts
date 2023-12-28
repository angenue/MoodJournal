import app from "./app";
import env from "./util/validateEnv"
import mongoose from "mongoose";
import express from 'express';
import path from 'path';

const port = env.PORT;


mongoose.connect(env.MONGO_CONNECTION_STRING).then(() => {
  console.log("Mongoose connected");

  // Serve static files from the React app in production
  if (process.env.NODE_ENV === 'production') {
    // Set the static folder to the build directory of the React app
    app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

    // Serve the React app's index.html file if no backend routes match
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
})
.catch(console.error);

/*mongoose.connect(env.MONGO_CONNECTION_STRING).then(() => {
  console.log("Mongoose connected");
  app.listen(port, () => {
    console.log("Server running on port: " + port);
  });
})
.catch(console.error);*/
