import { DataTypes, Model } from "sequelize";
import { User } from "./UserModel.js";

class Email extends Model {}

const defineEmail = (sequelize) => {
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
      sequelize,
      tableName: "emails",
      timestamps: true,
    }
  );
};

export { Email, defineEmail };