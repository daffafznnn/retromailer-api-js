import { DataTypes } from "sequelize";
import { db } from "../config/Database.js";
import User from "./UserModel.js";

class Email extends Model {
  static associate() {
    // define association here

    Email.belongsTo(User, { foreignKey: "user_id" });

    User.hasMany(Email, { foreignKey: "user_id" });

    Email.hasMany(Recipient, { foreignKey: "email_id" });

    Recipient.belongsTo(Email, { foreignKey: "email_id" });

    Email.hasMany(Attachment, { foreignKey: "email_id" });

    Attachment.belongsTo(Email, { foreignKey: "email_id" });

    Email.hasMany(Recipient, { foreignKey: "email_id" });

    Recipient.belongsTo(Email, { foreignKey: "email_id" });

    Email.hasMany(Attachment, { foreignKey: "email_id" });

    Attachment.belongsTo(Email, { foreignKey: "email_id" });
  }
}

Email.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "sent", "failed"),
      defaultValue: "draft",
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "emails",
    timestamps: true,
  }
);

User.hasMany(Email, { foreignKey: "user_id" });
Email.belongsTo(User, { foreignKey: "user_id" });

export default Email;
