import { Email } from "../models/EmailModel.js";
import { Recipient } from "../models/RecipientModel.js";
import { Attachment } from "../models/AttachmentModel.js";
import BaseRepository from "../common/BaseRepository.js";

class EmailRepository extends BaseRepository {
  constructor() {
    super(Email);
  }

  async createEmailWithRecipientsAndAttachments(
    emailData,
    recipients,
    attachments
  ) {
    const transaction = await Email.sequelize.transaction();
    try {
      // Simpan email
      const email = await Email.create(emailData, { transaction });

      // Simpan penerima
      for (const recipientEmail of recipients) {
        await Recipient.create(
          {
            email_id: email.id,
            recipient_email: recipientEmail,
          },
          { transaction }
        );
      }

      // Simpan lampiran
      for (const attachment of attachments) {
        await Attachment.create(
          {
            email_id: email.id,
            file_name: attachment.file_name,
            file_path: attachment.file_path,
          },
          { transaction }
        );
      }

      // Commit transaction
      await transaction.commit();
      return email;
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error;
    }
  }
}

export default new EmailRepository();