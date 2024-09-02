import app from "./app.js";
import dotenv from "dotenv";
import logger from "./utils/logger.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development" }.local` });

const startServer = async () => {
  try {
    const { connectToDatabase } = await import("./config/Database.js");

    await connectToDatabase();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Enviroment: ${process.env.NODE_ENV}`);
      logger.info(`Server Running and listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
