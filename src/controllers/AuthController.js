// src/controllers/AuthController.js
import AuthService from "../services/AuthService.js";
import handleError from "../utils/handleErrorController.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

class AuthController {
  constructor() {
    this.authService = AuthService;
    this.handleError = handleError;
  }

  // Handle registration
  async registerUser(req, res) {
    try {
      const user = await this.authService.registerUser(req.body, req);
      res.status(201).json({
        status: true,
        payload: user,
        message: "User registered successfully. Please verify your email.",
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Handle login
  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const { accessToken, refreshToken } = await this.authService.loginUser(
        email,
        password
      );
      res.status(200).json({
        status: true,
        payload: { accessToken, refreshToken },
        message: "Login successful.",
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Handle email verification
  async verifyEmail(req, res) {
    const { token } = req.query;

    try {
      const user = await this.authService.verifyEmail(token);
      res.status(200).json({
        status: true,
        payload: user,
        message: "Email verified successfully.",
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Handle token refresh
  async refreshToken(req, res) {
    const { refreshToken } = req.body;

    try {
      // Validasi input
      if (!refreshToken) {
        return res.status(400).json({
          status: false,
          message: "Refresh token is required.",
        });
      }

      const { accessToken } = await this.authService.refreshAccessToken(
        refreshToken
      );
      res.status(200).json({
        status: true,
        payload: { accessToken },
        message: "Access token refreshed successfully.",
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Handle Google login
  async googleLogin(req, res) {
    const user = req.user; // user info from Google

    try {
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      // Optionally, you can save the refresh token to the database here

      res.json({
        status: true,
        payload: { accessToken, refreshToken },
        message: "Google login successful.",
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async logoutUser(req, res) {
    const { refreshToken } = req.body;

    try {
      // Validasi input
      if (!refreshToken) {
        return res.status(400).json({
          status: false,
          message: "Refresh token is required.",
        });
      }

      // Hapus refresh token dari database
      await this.authService.logoutUser(refreshToken);
      res.status(200).json({
        status: true,
        message: "Logout successful and refresh token deleted.",
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Google login callback
  async googleCallback(req, res) {
    try {
      const { user, accessToken, refreshToken } = req.user;
      const tokens = await AuthService.handleGoogleLogin(user, {
        accessToken,
        refreshToken,
      });

      res.status(200).json({
        message: "Login successful",
        user: user,
        tokens: tokens,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
}

export default new AuthController();