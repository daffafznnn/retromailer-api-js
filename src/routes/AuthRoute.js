// src/routes/AuthRoute.js
import express from "express";
import AuthController from "../controllers/AuthController.js";
import passport from "../config/passport.js";

const router = express.Router();

router.post("/register", AuthController.registerUser.bind(AuthController));
router.post("/login", AuthController.loginUser.bind(AuthController));
router.get("/verify-email", AuthController.verifyEmail.bind(AuthController));
router.post("/refresh-token", AuthController.refreshToken.bind(AuthController));
router.post("/logout", AuthController.logoutUser.bind(AuthController));
// Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Rute callback untuk Google OAuth2
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }), // Disable session for API response
  AuthController.googleCallback.bind(AuthController)
);

export default router;