import { DataTypes, Model } from "sequelize";
import { Email } from "./EmailModel.js";

class Attachment extends Model {}

const defineAttachment = (sequelize) => {
  Attachment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Email,
          key: "id",
        },
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "attachments",
      timestamps: true,
    }
  );
};

export { Attachment, defineAttachment };