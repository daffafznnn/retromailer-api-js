import nodemailer from "nodemailer";
import UserRepository from "../repositories/UserRepository.js";
import crypto from "crypto";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

// Load environment variables from the appropriate .env file
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class EmailService {
  constructor() {
    this.userRepository = UserRepository;
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Read email template from file
    this.emailTemplate = fs.readFileSync(
      `${__dirname}/../templates/email-template-verify.html`,
      "utf8"
    );
  }

  async sendVerificationEmail(user, req) {
    // Generate a unique verification token
    const token = crypto.randomBytes(32).toString("hex");

    // Save the token to the user's record in the database
    user.verification_token = token;
    await this.userRepository.update(user.id, { verification_token: token });

    // Create a verification URL using req.protocol and req.get('host')
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/verify-email?token=${token}`;

    // Replace placeholder in email template
    const htmlContent = this.emailTemplate.replace(
      "{{verificationUrl}}",
      verificationUrl
    );

    // Email options
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Please verify your email",
      html: htmlContent,
    };

    // Send email
    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Verification email sent.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email.");
    }
  }
}

export default new EmailService();