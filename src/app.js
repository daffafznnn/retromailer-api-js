import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import passport from "./config/passport.js";
import { requestLogger } from "./middlewares/LoggerMiddleware.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/ErrorMiddleware.js";
import AuthRoute from "./routes/AuthRoute.js";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Initialize passport
app.use(passport.initialize());

// logger middleware
app.use(requestLogger);

// routes
app.use("/api/v1/auth", AuthRoute);

// error middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;