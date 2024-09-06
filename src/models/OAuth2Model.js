// src/models/OAuth2Model.js
import { DataTypes, Model } from "sequelize";
import { User } from "./UserModel.js"; // Asumsikan Anda sudah punya UserModel

class OAuth2 extends Model {}

const defineOAuth2 = (sequelize) => {
  OAuth2.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      access_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "oauth2",
      timestamps: true,
    }
  );
};

export { OAuth2, defineOAuth2 };