import "dotenv/config";

import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "❌ Failed to start server because MongoDB connection failed.",
      error,
    );

    process.exit(1);
  }
};

void startServer();