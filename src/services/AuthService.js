import UserRepository from "../repositories/UserRepository";
import {
  validateEmail,
  validatePassword,
  handleValidationErrors,
} from "../utils/validators.js";
import { validationResult } from "express-validator";

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
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
  async registerUser({ email, password, username }) {
    try {
      // Validasi input
      AuthService.validateInput(email, password);

      // Periksa apakah email sudah terdaftar
      const existingUser = await this.userRepository.isEmailRegistered(email);
      if (existingUser) {
        throw new Error("Email already in use.");
      }

      // Simpan pengguna baru
      const newUser = await this.userRepository.create({
        email,
        password,
        username,
      });
      return newUser;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }
}

export default new AuthService();
