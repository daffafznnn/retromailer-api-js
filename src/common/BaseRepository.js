class BaseRepository{

  constructor(model) {
    this.model = model;
  }
  async findAll() {
    return this.model.findAll();
  }

  async findById(id) {
    return this.model.findOne({ where: { id } });
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    return this.model.update(data, { where: { id } });
  }

  async delete(id) {
    return this.model.destroy({ where: { id } });
  }
}

export default BaseRepository;