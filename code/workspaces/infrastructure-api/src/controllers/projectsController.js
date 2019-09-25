import { check, param, matchedData } from 'express-validator';
import { service } from 'service-chassis';
import projectsRepository from '../dataaccess/projectsRepository';
import logger from '../config/logger';

async function listProjects(request, response, next) {
  try {
    const projects = await projectsRepository.getAll();
    response.send(projects);
  } catch (error) {
    next(new Error(`Error listing projects: ${error.message}`));
  }
}

async function getProjectByKey(request, response, next) {
  const { projectKey } = matchedData(request);

  try {
    const project = await projectsRepository.getByKey(projectKey);
    if (project) {
      response.send(project);
    } else {
      response.status(404).send();
    }
  } catch (error) {
    next(new Error(`Error getting project by key: ${error.message}`));
  }
}

async function createProject(request, response, next) {
  const project = matchedData(request, { locations: ['body'] });

  if (await projectsRepository.exists(project.key)) {
    response.status(400).send({
      errors: [{ msg: `Entry with key '${project.key}' already exists.` }],
    });
  } else {
    try {
      const createdProject = await projectsRepository.create(project);
      response.status(201).send(createdProject);
    } catch (error) {
      next(new Error(`Error creating project: ${error.message}`));
    }
  }
}

async function createOrUpdateProject(request, response, next) {
  const { projectKey } = matchedData(request, { locations: ['params'] });
  const project = matchedData(request, { locations: ['body'] });

  try {
    const exists = await projectsRepository.exists(projectKey);
    const dbProject = await projectsRepository.createOrUpdate(project);
    response.status(exists ? 200 : 201).send(dbProject);
  } catch (error) {
    next(new Error(`Error creating or updating project: ${error.message}`));
  }
}

async function deleteProjectByKey(request, response, next) {
  const { projectKey } = matchedData(request);

  try {
    const result = await projectsRepository.deleteByKey(projectKey);
    if (result.n === 0) {
      response.status(404).send(false);
    } else {
      response.send(true);
    }
  } catch (error) {
    next(new Error(`Error deleting project: ${error.message}`));
  }
}

async function projectKeyIsUnique(request, response, next) {
  const { projectKey } = matchedData(request);

  try {
    const exists = await projectsRepository.exists(projectKey);
    response.send(!exists);
  } catch (error) {
    next(new Error(`Error checking project key uniqueness: ${error.message}`));
  }
}

const actionWithKeyValidator = () => service.middleware.validator([
  check('projectKey').exists().withMessage("Project 'projectKey' must be specified in URL."),
], logger);

// Checking fields makes them appear in matchedData which is used to get the data
// from the body of the request.
const projectDocumentValidator = () => service.middleware.validator([
  check('key')
    .exists()
    .withMessage("'key' must be specified in request body.")
    .isLength({ min: 2 })
    .withMessage("'key' must be 2 or more characters long.")
    .trim(),
  check('name')
    .exists()
    .withMessage("'name' must be specified in request body.")
    .isLength({ min: 2 })
    .withMessage("'name' must be 2 or more characters long.")
    .trim(),
  check('description'),
  check('collaborationLink'),
], logger);

const urlAndBodyProjectKeyMatchValidator = () => service.middleware.validator([
  param('projectKey')
    .custom((projectKey, { req }) => {
      if (projectKey !== req.body.key) {
        throw new Error("'projectKey' parameter in URL and 'key' field in request body must "
      + `match. Got '${projectKey}' in URL and '${req.body.key}' in body.`);
      }
      return true;
    }),
], logger);

export default {
  listProjects,
  getProjectByKey,
  createProject,
  createOrUpdateProject,
  deleteProjectByKey,
  projectKeyIsUnique,
  actionWithKeyValidator,
  projectDocumentValidator,
  urlAndBodyProjectKeyMatchValidator,
};
