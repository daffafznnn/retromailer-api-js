import BulkEmailService from "../services/BulkEmailService.js";
import handleError from "../utils/handleErrorController.js";

class EmailController {
  constructor() {
    this.handleError = handleError;
  }
  async sendBulkEmail(req, res) {
    try {
      const userId = req.userId; // Get userId from authentication middleware
      const { subject, body, recipients } = req.body; // Get email data from request body

      // Get attachments from multer
      const attachments = req.files.map((file) => ({
        file_name: file.originalname,
        file_path: file.path,
      }));

      // Call BulkEmailService to send the email
      await BulkEmailService.sendBulkEmail(
        userId,
        { subject, body },
        recipients.split(","), // Split recipients by comma
        attachments
      );

      return res.status(200).json({ message: "Bulk email successfully sent." });
    } catch (error) {
      console.error("Failed to send email:", error);
      return this.handleError(res, error);
    }
  }
}

export default new EmailController();