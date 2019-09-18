import { check, matchedData } from 'express-validator';
import { service } from 'common';
import projectsRepository from '../dataaccess/projectsRepository';

async function listProjects(request, response, next) {
  try {
    const projects = await projectsRepository.getAll() || [];
    response.send(projects);
  } catch (error) {
    next(new Error(`Error listing projects: ${error.message}`));
  }
}

async function getProjectByKey(request, response, next) {
  const { key } = matchedData(request);

  try {
    const project = await projectsRepository.getByKey(key);
    if (project) response.send(project);
    else response.status(404).send();
  } catch (error) {
    next(new Error(`Error getting project by key: ${error.message}`));
  }
}

async function createProject(request, response, next) {
  const document = request.body;

  if (await projectsRepository.exists(document)) {
    response.status(400).send({
      errors: [{ msg: `Entry with projectKey '${document.projectKey}' already exists.` }],
    });
  } else {
    try {
      const project = await projectsRepository.create(document);
      response.status(201).send(project);
    } catch (error) {
      next(new Error(`Error creating project: ${error.message}`));
    }
  }
}

async function createOrUpdateProject(request, response, next) {
  const { key } = matchedData(request);
  const document = request.body;

  if (key !== document.projectKey) {
    const msg = "'key' parameter in URL and 'projectKey' field in request body must "
      + `match. Got key='${key}' and projectKey='${document.projectKey}'.`;
    response.status(400).send({ errors: [{ msg }] });
  } else {
    try {
      // Doesn't return object if it is created hence gets by key if there is no return
      // value from createOrUpdate
      const project = await projectsRepository.createOrUpdate(document) || await projectsRepository.getByKey(key);
      response.status(201).send(project);
    } catch (error) {
      next(new Error(`Error creating or updating project: ${error.message}`));
    }
  }
}

async function deleteProjectByKey(request, response, next) {
  const { key } = matchedData(request);

  try {
    const result = await projectsRepository.deleteByKey(key);
    if (result.n === 0) response.status(404).send();
    else response.send(result);
  } catch (error) {
    next(new Error(`Error deleting project: ${error.message}`));
  }
}

const actionWithKeyValidator = () => service.middleware.validator([
  check('key').exists().withMessage("Project 'key' must be specified in URL."),
]);

const projectDocumentValidator = () => service.middleware.validator([
  check('projectKey')
    .exists()
    .withMessage("'projectKey' must be specified in POST body.")
    .isLength({ min: 4 })
    .withMessage("'projectKey' must be greater than 4 characters long.")
    .trim(),
]);

export default {
  listProjects,
  getProjectByKey,
  createProject,
  createOrUpdateProject,
  deleteProjectByKey,
  actionWithKeyValidator,
  projectDocumentValidator,
};
