import UserRepository from "../repositories/UserRepository.js";

class UserService {

  constructor() {
    this.userRepository = UserRepository;
  }

  
}

export default new UserService();