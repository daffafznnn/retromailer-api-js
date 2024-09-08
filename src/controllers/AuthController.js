// src/controllers/AuthController.js
import AuthService from "../services/AuthService.js";
import handleError from "../utils/handleErrorController.js";
import removeSensitiveFields from "../utils/removeSensitiveFields.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

class AuthController {
  constructor() {
    this.handleError = handleError;
  }

  // Handle registration
  async registerUser(req, res) {
    try {
      const user = await AuthService.registerUser(req.body, req);
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
      const { accessToken, refreshToken } = await AuthService.loginUser(
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
      const user = await AuthService.verifyEmail(token);
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
      if (!refreshToken) {
        return res.status(400).json({
          status: false,
          message: "Refresh token is required.",
        });
      }

      const { accessToken } = await AuthService.refreshAccessToken(
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

  // Handle logout
  async logoutUser(req, res) {
    const { refreshToken } = req.body;

    try {
      if (!refreshToken) {
        return res.status(400).json({
          status: false,
          message: "Refresh token is required.",
        });
      }

      await AuthService.logoutUser(refreshToken);
      res.status(200).json({
        status: true,
        message: "Logout successful and refresh token deleted.",
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
}

export default new AuthController();