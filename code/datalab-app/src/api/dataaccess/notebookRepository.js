import { find } from 'lodash';
import notebooks from './notebooks.json';

class NotebookRepository {
  constructor() {
    this.getAll = this.getAll.bind(this);
  }

  getAll(user) {
    // filter notebooks using user attributes
    return notebooks;
  }

  getById(user, id) {
    // filter by user attributes and notebook id
    return find(notebooks, { id });
  }
}

export default new NotebookRepository();
