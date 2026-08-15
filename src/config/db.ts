import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI is not defined in environment variables."
    );
  }

  try {
    console.log(mongoUri);
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      `✅ MongoDB connected: ${connection.connection.host}`
    );

    // Test the connection
    await connection.connection.db?.admin().ping();

    console.log("🏓 MongoDB ping successful!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error);

    throw error;
  }
};

mongoose.connection.on("error", (error) => {
  console.error("❌ MongoDB runtime error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});