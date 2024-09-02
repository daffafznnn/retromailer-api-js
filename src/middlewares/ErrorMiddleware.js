import logger from "../utils/logger.js";
import createError from "http-errors";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(`Error: ${err.message}`);
  logger.error(`Stack: ${err.stack}`); // Tambahkan logging stack trace

  // Set status code if not set
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: statusCode,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Tampilkan stack trace jika dalam mode pengembangan
  });
};

export const notFoundHandler = (req, res, next) => {
  next(createError(404, "Not Found"));
};
