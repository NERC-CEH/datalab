import dataStorageRepository from '../dataaccess/dataStorageRepository';
import stacksRepository from '../dataaccess/stacksRepository';
import projectsRepository from '../dataaccess/projectsRepository';

async function getAllProjectsAndResources(request, response, next) {
  try {
    const projects = await projectsRepository.getAll();
    const storage = await dataStorageRepository.getAllActive();
    const stacks = await stacksRepository.getAllStacks();

    response.send({
      projects,
      storage,
      stacks,
    });
  } catch (error) {
    next(new Error(`Unable to get all projects and resources: ${error.message}`));
  }
}

export default { getAllProjectsAndResources };
