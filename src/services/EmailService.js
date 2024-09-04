import nodemailer from "nodemailer";
import UserRepository from "../repositories/UserRepository.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
  constructor() {
    this.userRepository = UserRepository;
    this.transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.SENDINBLUE_USER,
        pass: process.env.SENDINBLUE_PASSWORD,
      },
    });
  }

  // Generate verification token and send email
  async sendVerificationEmail(user, req) {
    // Generate a unique verification token
    const token = crypto.randomBytes(32).toString("hex");

    // Save the token to the user's record in the database
    user.verification_token = token;
    await this.userRepository.update(user.id, { verification_token: token });

    // Create a verification URL using req.protocol and req.get('host')
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/verify-email?token=${token}`;

    // Email options
    const mailOptions = {
      from: `"No Reply" <${process.env.SENDINBLUE_SENDER}>`,
      to: user.email,
      subject: "Please verify your email",
      html: `<p>Thank you for registering. Please click the following link to verify your email:</p>
             <a href="${verificationUrl}">${verificationUrl}</a>`,
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