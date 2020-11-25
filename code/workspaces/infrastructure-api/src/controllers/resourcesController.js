import dataStorageRepository from '../dataaccess/dataStorageRepository';
import stacksRepository from '../dataaccess/stacksRepository';
import projectsRepository from '../dataaccess/projectsRepository';

async function getAllProjectsAndResources(request, response, next) {
  try {
    const data = await Promise.all([
      projectsRepository.getAll(),
      dataStorageRepository.getAllActive(),
      stacksRepository.getAllStacks(),
    ]);
    const projects = data[0];
    const storage = data[1];
    const stacks = data[2];

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
