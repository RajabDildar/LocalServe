import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

console.log("Starting server...");
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    console.log(`Connecting to DB successful, listening on ${PORT}`);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
