import "dotenv/config";

import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB first
    await connectDatabase();

    // Only start the server if MongoDB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "❌ Failed to start server because MongoDB connection failed."
    );

    process.exit(1);
  }
};

void startServer();