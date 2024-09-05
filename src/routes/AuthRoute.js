// src/routes/AuthRoute.js
import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

router.post("/register", AuthController.registerUser.bind(AuthController));
router.post("/login", AuthController.loginUser.bind(AuthController));
router.get("/verify-email", AuthController.verifyEmail.bind(AuthController));
router.post("/refresh-token", AuthController.refreshToken.bind(AuthController));

export default router;