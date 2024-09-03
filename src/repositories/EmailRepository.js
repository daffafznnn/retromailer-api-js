import Email from "../models/EmailModel";

class EmailRepository {
  async findById(id) {
    return Email.findOne({ where: { id } });
  }
  async create(email) {
    return Email.create(email);
  }
  async update(email) {
    return email.update({
      where: { id: email.id },
    });
  }

  async delete(email) {
    return email.destroy({
      where: { id: email.id },
    });
  }

}

export default new EmailRepository();