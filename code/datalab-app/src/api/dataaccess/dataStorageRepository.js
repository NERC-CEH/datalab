import { find } from 'lodash';
import dataStorage from './dataStorage.json';

class DataStorageRepository {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
  }

  getAll() {
    return dataStorage;
  }

  getById(id) {
    return find(dataStorage, { id });
  }
}

export default new DataStorageRepository();
