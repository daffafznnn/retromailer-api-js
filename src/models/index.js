import { defineUser, User } from "./UserModel.js";
import { defineEmail, Email } from "./EmailModel.js";
import { defineRecipient, Recipient } from "./RecipientModel.js";
import { defineAttachment, Attachment } from "./AttachmentModel.js";
import { defineRefreshToken, RefreshToken } from "./RefreshTokenModel.js";

const setupModels = (sequelize) => {
  defineUser(sequelize);
  defineRefreshToken(sequelize);
  defineEmail(sequelize);
  defineRecipient(sequelize);
  defineAttachment(sequelize);

  // Relasi
  User.hasMany(Email, { foreignKey: "user_id" });
  Email.belongsTo(User, { foreignKey: "user_id" });

  RefreshToken.belongsTo(User, { foreignKey: "user_id" });
  User.hasMany(RefreshToken, { foreignKey: "user_id" });

  Email.hasMany(Recipient, { foreignKey: "email_id" });
  Recipient.belongsTo(Email, { foreignKey: "email_id" });

  Email.hasMany(Attachment, { foreignKey: "email_id" });
  Attachment.belongsTo(Email, { foreignKey: "email_id" });
};

export default setupModels;