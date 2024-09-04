import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { requestLogger } from "./middlewares/LoggerMiddleware.js";
import { errorHandler, notFoundHandler } from "./middlewares/ErrorMiddleware.js";
import AuthRoute from "./routes/AuthRoute.js";

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// logger middleware
app.use(requestLogger);

// routes
app.use("/api/v1/auth", AuthRoute);

// error middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;