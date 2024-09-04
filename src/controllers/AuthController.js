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
      const { username, email, password } = req.body;
      const user = await this.authService.registerUser(
        { username, email, password },
        req
      );
      res.status(201).json({
        status: "success",
        data: user,
        message: "User registered successfully. Please verify your email.",
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Handle login
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await this.authService.loginUser(
        email,
        password
      );
      res.status(200).json({
        status: "success",
        data: { accessToken, refreshToken },
        message: "Login successful.",
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Handle email verification
  async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      const user = await this.authService.verifyEmail(token);
      res.status(200).json({
        status: "success",
        data: user,
        message: "Email verified successfully.",
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Handle token refresh
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const { accessToken } = await this.authService.refreshAccessToken(
        refreshToken
      );
      res.status(200).json({
        status: "success",
        data: { accessToken },
        message: "Access token refreshed successfully.",
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
}

export default new AuthController();