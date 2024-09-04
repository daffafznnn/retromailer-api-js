import BaseRepository from "../common/BaseRepository.js";
import { User } from "../models/UserModel.js";


class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }
  async findByEmail(email) {
    return this.model.findOne({ where: { email } });
  }

  async isEmailRegistered(email) {
    const user = await this.findByEmail(email);
    return !!user;
  }

  async findByEmail(email) {
    return this.model.findOne({ where: { email } });
  }

  async findByVerificationToken(token) {
    return this.model.findOne({ where: { verification_token: token } });
  }

}

export default new UserRepository();