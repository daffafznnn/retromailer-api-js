import { OAuth2 } from "../models/OAuth2Model.js";
import BaseRepository from "../common/BaseRepository.js";

class OAuth2Repository extends BaseRepository {
  constructor() {
    super(OAuth2);
  }

  async upsert(oauth2Data) {
    return OAuth2.upsert(oauth2Data)
      .then(([oauth2]) => oauth2)
      .catch((error) => {
        throw new Error(`Failed to upsert OAuth2 token: ${error.message}`);
      });
  }

  async findByUserId(userId) {
    return OAuth2.findOne({ where: { user_id: userId } }).catch((error) => {
      throw new Error(`Failed to find OAuth2 token: ${error.message}`);
    });
  }

  async deleteByUserId(userId) {
    return OAuth2.destroy({ where: { user_id: userId } }).catch((error) => {
      throw new Error(`Failed to delete OAuth2 token: ${error.message}`);
    });
  }
}

export default new OAuth2Repository();