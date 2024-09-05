// src/controllers/AuthController.js
import AuthService from "../services/AuthService.js";
import handleError from "../utils/handleErrorController.js";

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
}

export default new AuthController();