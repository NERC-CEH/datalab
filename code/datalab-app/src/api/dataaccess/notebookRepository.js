import notebooks from './notebooks.json';

class NotebookRepository {
  constructor() {
    this.getAll = this.getAll.bind(this);
  }

  getAll(user) {
    // filter notebooks using user attributes
    return notebooks;
  }
}

export default new NotebookRepository();
