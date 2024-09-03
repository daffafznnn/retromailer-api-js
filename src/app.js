import express from "express";
import cors from "cors";
import helmet from "helmet";
import { requestLogger } from "./middlewares/LoggerMiddleware.js";
import { errorHandler, notFoundHandler } from "./middlewares/ErrorMiddleware.js";
// import { db } from "./config/Database.js";

// (async()=>{
//     await db.sync();
// })()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// logger middleware
app.use(requestLogger);

// routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Retromailer API!" });
});

// error middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;