import nodemailer from "nodemailer";
import UserRepository from "../repositories/UserRepository.js";
import EmailRepository from "../repositories/EmailRepository.js";
import OAuth2Repository from "../repositories/OAuth2Repository.js";
import { OAuth2Client } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";

// Anda mungkin perlu mendapatkan token OAuth2 dari pengguna saat login
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // Redirect URL atau URL yang sesuai dengan OAuth2 client Anda
);

class BulkEmailService {
  async sendBulkEmail(userId, emailData, recipients, attachments) {
    // Ambil data pengguna termasuk token akses OAuth2
     const user = await UserRepository.findById(userId);

     if (!user) {
       throw new Error("Pengguna tidak ditemukan.");
     }

     // Ambil token OAuth2 dari database
     const oauth2 = await OAuth2Repository.findOne({
       where: { user_id: userId },
     });

     if (!oauth2 || !oauth2.access_token) {
       throw new Error("OAuth2 token tidak tersedia untuk pengguna ini.");
     }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: user.email,
        accessToken: oauth2.access_token, // Token akses OAuth2 dari pengguna
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: oauth2.refresh_token, // Refresh token jika ada
      },
    });

    // Kirim email menggunakan transporter
    try {
      // Kirim email
      await transporter.sendMail({
        from: user.email, // Gunakan email pengguna yang sedang login
        to: recipients,
        subject: emailData.subject,
        text: emailData.body,
        attachments: attachments.map((attachment) => ({
          filename: attachment.file_name,
          path: attachment.file_path,
        })),
      });

      console.log("Email berhasil dikirim.");

      // Simpan riwayat email
      await EmailRepository.createEmailWithRecipientsAndAttachments(
        {
          id: uuidv4(),
          user_id: user.id,
          subject: emailData.subject,
          body: emailData.body,
          status: "sent",
        },
        recipients,
        attachments
      );
    } catch (error) {
      console.error("Gagal mengirim email:", error);
      throw new Error("Gagal mengirim email.");
    }
  }
}

export default new BulkEmailService();