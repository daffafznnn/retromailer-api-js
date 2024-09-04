import UserRepository from "../repositories/UserRepository.js";
import RefreshTokenRepository from "../repositories/RefreshTokenRepository.js";
import { validateEmail, validatePassword } from "../utils/validators.js";
import { hashPassword } from "../utils/passwordHash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/token.js";
import EmailService from "./EmailService.js";

class AuthService {
  constructor() {
    this.userRepository = UserRepository;
    this.refreshTokenRepository = RefreshTokenRepository;
  }

  // Method untuk memvalidasi input pengguna
  static validateInput(email, password) {
    const errors = [];
    if (!validateEmail(email)) {
      errors.push("Invalid email format.");
    }
    if (!validatePassword(password)) {
      errors.push("Password must be at least 6 characters long.");
    }
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }
  }

  // Register a new user
  async registerUser({ username, email, password }, req) {
    try {
      // Validasi input
      AuthService.validateInput(email, password);

      // Periksa apakah email sudah terdaftar
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error("Email already in use.");
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Simpan pengguna baru
      const newUser = await this.userRepository.create({
        username,
        email,
        password: hashedPassword,
      });

      // Kirim email verifikasi
      await EmailService.sendVerificationEmail(newUser, req);

      return newUser;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Login user and generate tokens
  async loginUser(email, password) {
    try {
      // Validasi input
      AuthService.validateInput(email, password);

      // Temukan pengguna berdasarkan email
      const user = await this.userRepository.findByEmail(email);
      if (!user || !((await hashPassword(password)) === user.password)) {
        throw new Error("Invalid email or password.");
      }

      // Generate tokens
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      // Simpan refresh token
      await this.refreshTokenRepository.create({
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      // Temukan pengguna dengan token verifikasi yang sesuai
      const user = await this.userRepository.findByVerificationToken(token);
      if (!user) {
        throw new Error("Invalid or expired verification token.");
      }

      // Perbarui status verifikasi pengguna
      user.is_verified = true;
      user.verification_token = null; // Hapus token setelah verifikasi
      await this.userRepository.update(user.id, {
        is_verified: user.is_verified,
        verification_token: user.verification_token,
      });

      return user;
    } catch (error) {
      throw new Error(`Email verification failed: ${error.message}`);
    }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    try {
      // Verifikasi refresh token
      const payload = verifyToken(refreshToken, "refresh");
      const tokenRecord = await this.refreshTokenRepository.findByToken(
        refreshToken
      );

      if (!tokenRecord || tokenRecord.expires_at < new Date()) {
        throw new Error("Invalid or expired refresh token.");
      }

      // Generate new access token
      const accessToken = generateAccessToken(payload.userId);

      return { accessToken };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }
}

export default new AuthService();