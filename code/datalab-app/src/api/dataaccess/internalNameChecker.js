import Promise from 'bluebird';
import dataStorageRepository from '../dataaccess/dataStorageRepository';
import stackService from '../dataaccess/stackService';

const isNameUnique = (user, name) =>
  Promise.all([
    dataStorageRepository.getAllByName(user, name)
      .then(response => (response && response.id) || null),
    stackService.getByName(user, name),
  ]).then(ids => ids.every(id => id === null));

export default isNameUnique;
