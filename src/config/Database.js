// Database.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import setupModels from "../models/index.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not defined. Please check your environment variables."
  );
}

const db = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
});

async function connectToDatabase() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");

    setupModels(db); // Inisialisasi dan relasi model setelah db terhubung

    // await db.sync({ alter: true });
    // console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
}

export { db, connectToDatabase };