import "dotenv/config";

import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  try {
    await connectDatabase();
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB.", error);

    process.exit(1);
  }
};

void startServer();
