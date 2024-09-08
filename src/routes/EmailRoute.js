// src/routes/EmailRoute.js
import express from "express";
import multer from "multer";
import path from "path";
import EmailController from "../controllers/EmailController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const upload = multer({
  dest: path.join("src", "uploads"),
});

const router = express.Router();

// Menggunakan AuthMiddleware.authenticate untuk memeriksa autentikasi
router.post(
  "/send-bulk-email",
  AuthMiddleware.authenticate,
  upload.array("attachments"),
  (req, res) => {
    EmailController.sendBulkEmail(req, res);
  }
);

export default router;