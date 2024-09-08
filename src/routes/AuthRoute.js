// src/routes/AuthRoute.js
import { Router } from "express";
import passport from "passport";
import AuthController from "../controllers/AuthController.js";

const router = Router();

// Register user
router.post("/register", (req, res) => AuthController.registerUser(req, res));

// Login user
router.post("/login", (req, res) => AuthController.loginUser(req, res));

// Verify email
router.get("/verify-email", (req, res) => AuthController.verifyEmail(req, res));

// Refresh access token
router.post("/refresh-token", (req, res) =>
  AuthController.refreshToken(req, res)
);

// Google login route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Authentication failed.",
      });
    }

    const { user, accessToken, refreshToken } = req.user;

    res.status(200).json({
      status: "success",
      message: "Google login successful",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  }
);

// Logout user
router.post("/logout", (req, res) => AuthController.logoutUser(req, res));

export default router;