import "dotenv/config";
import app from "./app.js";
import mongoose from "mongoose";

const PORT: number = process.env.PORT ? Number(process.env.PORT) : 5000;

mongoose
  .connect("mongodb://127.0.0.1:27017/localserve")
  .then((): void => {
    app.listen(PORT, (): void => {
      console.log(`app is listening at PORT ${PORT}`);
    });
  })
  .catch((): void => {
    console.log("Failed to connect with DB. Internal Server error.");
  });
