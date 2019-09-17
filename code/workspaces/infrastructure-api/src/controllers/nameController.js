import { matchedData } from 'express-validator';
import stackRepository from '../dataaccess/stacksRepository';
import dataStorageRepository from '../dataaccess/dataStorageRepository';

async function isUnique(request, response) {
  const { name } = matchedData(request);

  const stack = await stackRepository.getOneByName(request.user, name);
  const volume = await dataStorageRepository.getAllByName(request.user, name);

  if (stack || volume) {
    return response.send({ isUnique: false });
  }
  return response.send({ isUnique: true });
}

export default { isUnique };
