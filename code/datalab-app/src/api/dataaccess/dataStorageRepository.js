import { find } from 'lodash';
import dataStorage from './dataStorage.json';

class DataStorageRepository {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
  }

  getAll(user) {
    // filter data storage using user attributes
    return dataStorage;
  }

  getById(user, id) {
    // filter by user attributes and data store id
    return find(dataStorage, { id });
  }
}

export default new DataStorageRepository();
