import { DataTypes, Model } from "sequelize";
import { Email } from "./EmailModel.js";

class Recipient extends Model {}

const defineRecipient = (sequelize) => {
  Recipient.init(
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
      recipient_email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "recipients",
      timestamps: true,
    }
  );
};

export { Recipient, defineRecipient };