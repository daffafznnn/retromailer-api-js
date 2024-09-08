import nodemailer from "nodemailer";
import UserRepository from "../repositories/UserRepository.js";
import EmailRepository from "../repositories/EmailRepository.js";
import OAuth2Repository from "../repositories/OAuth2Repository.js";

class BulkEmailService {
  async sendBulkEmail(userId, emailData, recipients, attachments) {
    if (!userId) {
      throw new Error("userId cannot be empty.");
    }

    // Get user data including OAuth2 access token
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    // Get OAuth2 token from the database
    const oauth2 = await OAuth2Repository.findByUserId(userId);

    if (!oauth2 || !oauth2.access_token) {
      throw new Error("OAuth2 token is not available for this user.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: user.email,
        accessToken: oauth2.access_token, // OAuth2 access token from the user
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: oauth2.refresh_token, // Refresh token if available
      },
    });

    // Initialize variable to store send status
    let status = "sent"; // Default status is 'sent'

    // Send email using transporter
    try {
      // Send email
      await transporter.sendMail({
        from: user.email, // Use the email of the logged-in user
        to: recipients,
        subject: emailData.subject,
        text: emailData.body,
        attachments: attachments.map((attachment) => ({
          filename: attachment.file_name,
          path: attachment.file_path,
        })),
      });

      console.log("Email successfully sent.");
    } catch (error) {
      console.error("Failed to send email:", error);
      status = "failed"; // If failed, change status to 'failed'
    }

    // Save email history with send status
    await EmailRepository.createEmailWithRecipientsAndAttachments(
      {
        user_id: user.id,
        subject: emailData.subject,
        body: emailData.body,
        status: status, // Save 'sent' or 'failed' status
      },
      recipients,
      attachments
    );

    // If sending failed, throw error to be handled in the controller
    if (status === "failed") {
      throw new Error("Failed to send email.");
    }
  }
}

export default new BulkEmailService();