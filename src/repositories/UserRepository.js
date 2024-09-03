import BaseRepository from "../common/BaseRepository";
import User from "../models/UserModel";


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
}

export default new UserRepository();