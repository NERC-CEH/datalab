import Promise from 'bluebird';
import dataStorageRepository from './dataStorageRepository';
import stackService from './stackService';

const isNameUnique = (user, name) => Promise.all([
  dataStorageRepository.getAllByName(user, name)
    .then(response => (response && response.id) || null),
  stackService.getByName(user, name),
]).then(ids => ids.every(id => id === null));

export default isNameUnique;
