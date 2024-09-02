import { DataTypes } from "sequelize";
import { db } from "../config/Database";

const Email = db.define("Email", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  recipient: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("sent", "failed", "pending"),
    defaultValue: "pending",
  },
}, {
  freezeTableName: true
});

