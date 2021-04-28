import dataStorageRepository from '../dataaccess/dataStorageRepository';
import stacksRepository from '../dataaccess/stacksRepository';
import projectsRepository from '../dataaccess/projectsRepository';
import clustersRepository from '../dataaccess/clustersRepository';

async function getAllProjectsAndResources(request, response, next) {
  try {
    const [projects, storage, stacks, clusters] = await Promise.all([
      projectsRepository.getAll(),
      dataStorageRepository.getAllActive(),
      stacksRepository.getAllStacks(),
      clustersRepository.getAll(),
    ]);

    response.send({
      projects,
      storage,
      stacks,
      clusters,
    });
  } catch (error) {
    next(new Error(`Unable to get all projects and resources: ${error.message}`));
  }
}

export default { getAllProjectsAndResources };
