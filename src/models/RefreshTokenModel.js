import { DataTypes, Model } from "sequelize";
import { User } from "./UserModel.js";

class RefreshToken extends Model { }

const defineRefreshToken = (sequelize) => {
  RefreshToken.init(
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
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "refresh_tokens",
      timestamps: true, // atau false, tergantung apakah Anda ingin mencatat waktu pembuatan dan pembaruan
    }
  );
};

export { RefreshToken, defineRefreshToken };