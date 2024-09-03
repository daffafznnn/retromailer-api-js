import { DataTypes } from "sequelize";
import { db } from "../config/Database.js";
import Email from "./EmailModel.js";

const Attachment = db.define(
  "attachment",
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
    timestamps: true,
  }
);

Attachment.belongsTo(Email, { foreignKey: "email_id" });

export default Attachment;