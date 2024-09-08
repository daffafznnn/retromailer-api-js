// src/services/AuthService.js
import UserRepository from "../repositories/UserRepository.js";
import RefreshTokenRepository from "../repositories/RefreshTokenRepository.js";
import { hashPassword, comparePassword } from "../utils/passwordHash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/token.js";
import EmailService from "./EmailService.js";
import HttpError from "../utils/httpError.js";
import removeSensitiveFields from "../utils/removeSensitiveFields.js";
import OAuth2Repository from "../repositories/OAuth2Repository.js";

class AuthService {
  // Method untuk memvalidasi input pengguna
  static validateInput(email, password) {
    const errors = [];
    if (!email || !email.includes("@")) {
      errors.push("Invalid email format.");
    }
    if (!password || password.length < 6) {
      errors.push("Password must be at least 6 characters long.");
    }

    if (!email || !password) {
      throw { statusCode: 400, message: "Email and password are required." };
    }
    if (errors.length > 0) {
      throw { statusCode: 400, message: errors.join(" ") };
    }
  }

  // Register a new user
  async registerUser({ username, email, password }, req) {
    let newUser;
    try {
      // Validasi input
      AuthService.validateInput(email, password);

      // Periksa apakah email sudah terdaftar
      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        throw { statusCode: 400, message: "Email already in use." };
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Simpan pengguna baru
      newUser = await UserRepository.create({
        username,
        email,
        password: hashedPassword,
      });

      // Kirim email verifikasi
      await EmailService.sendVerificationEmail(newUser, req);

      return removeSensitiveFields(newUser);
    } catch (error) {
      // Jika ada error, hapus pengguna yang baru saja didaftarkan
      if (newUser) {
        await UserRepository.delete(newUser.id);
      }

      throw {
        statusCode: error.statusCode || 500,
        message: `Registration failed: ${error.message}`,
      };
    }
  }

  // Login user and generate tokens
  async loginUser(email, password) {
    try {
      // Validasi input
      AuthService.validateInput(email, password);

      // Temukan pengguna berdasarkan email
      const user = await UserRepository.findByEmail(email);

      if (!user) {
        throw new HttpError(404, "User not found.");
      }

      if (!(await comparePassword(password, user.password))) {
        throw new HttpError(401, "Invalid email or password.");
      }

      // Generate tokens
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      // Simpan refresh token
      await RefreshTokenRepository.create({
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new HttpError(
        error.statusCode || 500,
        `Login failed: ${error.message}`
      );
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      // Temukan pengguna dengan token verifikasi yang sesuai
      const user = await UserRepository.findByVerificationToken(token);
      if (!user) {
        throw new HttpError(400, "Invalid or expired verification token.");
      }

      // Perbarui status verifikasi pengguna
      user.is_verified = true;
      user.verification_token = null; // Hapus token setelah verifikasi
      await UserRepository.update(user.id, {
        is_verified: user.is_verified,
        verification_token: user.verification_token,
      });

      return removeSensitiveFields(user);
    } catch (error) {
      throw new HttpError(
        error.statusCode || 500,
        `Email verification failed: ${error.message}`
      );
    }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    try {
      // Verifikasi refresh token
      const payload = verifyToken(refreshToken, "refresh");
      const tokenRecord = await RefreshTokenRepository.findByToken(
        refreshToken
      );

      if (!tokenRecord || tokenRecord.expires_at < new Date()) {
        throw new HttpError(400, "Invalid or expired refresh token.");
      }

      // Generate new access token
      const accessToken = generateAccessToken(payload.userId);

      return { accessToken };
    } catch (error) {
      throw new HttpError(
        error.statusCode || 500,
        `Token refresh failed: ${error.message}`
      );
    }
  }

  async logoutUser(refreshToken) {
    try {
      // Verifikasi refresh token
      const payload = verifyToken(refreshToken, "refresh");

      // Cari refresh token yang sesuai di database
      const tokenRecord = await RefreshTokenRepository.findByToken(
        refreshToken
      );

      // Jika refresh token tidak ditemukan atau sudah kadaluarsa, lempar error
      if (!tokenRecord || tokenRecord.expires_at < new Date()) {
        throw new HttpError(400, "Invalid or expired refresh token.");
      }

      // Hapus refresh token dari database
      await RefreshTokenRepository.deleteByToken(refreshToken);

      await OAuth2Repository.deleteByUserId(payload.userId);

      return { message: "Successfully logged out." };
    } catch (error) {
      throw new HttpError(
        error.statusCode || 500,
        `Logout failed: ${error.message}`
      );
    }
  }
}

export default new AuthService();