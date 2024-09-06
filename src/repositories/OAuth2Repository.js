// src/repositories/OAuth2Repository.js
import { OAuth2 } from "../models/OAuth2Model.js";
import BaseRepository from "../common/BaseRepository.js";

class OAuth2Repository extends BaseRepository {
  constructor() {
    super(OAuth2);
  }

  async upsert(oauth2Data) {
    try {
      // Upsert (insert or update) OAuth2 record
      const [oauth2, created] = await OAuth2.upsert(oauth2Data);
      return oauth2;
    } catch (error) {
      throw new Error("Failed to upsert OAuth2 token: " + error.message);
    }
  }
}

export default new OAuth2Repository();
