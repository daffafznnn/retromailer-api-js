import { DataTypes } from "sequelize";
import { db } from "../config/Database.js";
import Email from "./EmailModel.js";

const Recipient = db.define(
  "recipient",
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
    timestamps: true,
  }
);

Recipient.belongsTo(Email, { foreignKey: "email_id" });

export default Recipient;