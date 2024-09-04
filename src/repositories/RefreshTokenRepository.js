import BaseRepository from "../common/BaseRepository.js";
import { RefreshToken } from "../models/RefreshTokenModel.js";

class RefreshTokenRepository extends BaseRepository {
  constructor() {
   super(RefreshToken);
  }

  async findByToken(token) {
    return this.model.findOne({ where: { token } });
  }

  async deleteByToken(token) {
    return this.model.destroy({ where: { token } });
  }

}

export default new RefreshTokenRepository();
