import { check, param, matchedData } from 'express-validator';
import { service } from 'service-chassis';
import projectsRepository from '../dataaccess/projectsRepository';
import projectNamespaceManager from '../kubernetes/projectNamespaceManager';
import projectRBACManager from '../kubernetes/projectRBACManager';
import logger from '../config/logger';

async function listProjects(request, response, next) {
  try {
    const projects = await projectsRepository.getAll();
    response.send(projects);
  } catch (error) {
    next(new Error(`Error listing projects: ${error.message}`));
  }
}

async function listProjectsForUser(request, response, next) {
  // Function to only get projects where the requesting user is at least a viewer (or is a system admin).
  const { user: { roles } } = request;
  const allowedProjects = roles.projectRoles.map(r => r.projectKey);

  try {
    const projects = roles.instanceAdmin
      ? await projectsRepository.getAll()
      : await projectsRepository.getProjectsWithIds(allowedProjects);
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

  const forbiddenNamespace = await projectNamespaceManager.checkForbiddenNamespaces(project.key);
  const projectExists = await projectsRepository.exists(project.key);

  if (forbiddenNamespace) {
    const msg = `Project Key '${project.key}' cannot be used as it is a forbidden namespace.`;
    logger.warn(msg);
    return response.status(400).send({
      errors: [{ msg }],
    });
  }

  if (projectExists) {
    const msg = `Entry with key '${project.key}' already exists.`;
    logger.warn(msg);
    return response.status(400).send({
      errors: [{ msg }],
    });
  }

  try {
    // Create namespaces first as in the case of failure this operation
    // can be retried given namespace creation is idempotent
    logger.info(`Creating Project: ${project.key}`);
    await projectNamespaceManager.idempotentCreateProjectNamespaces(project.key);
    await projectRBACManager.createProjectComputeRBAC(project.key);
    const createdProject = await projectsRepository.create(project);
    return response.status(201).send(createdProject);
  } catch (error) {
    return next(new Error(`Error creating project: ${error.message}`));
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
    // Delete Namespaces first to ensure the record is only deleted if namespaces successfully delete
    logger.info(`Deleting Project: ${projectKey}`);
    await projectNamespaceManager.idempotentDeleteProjectNamespaces(projectKey);
    await projectRBACManager.deleteProjectComputeRBAC(projectKey);
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
    .trim()
    .isLength({ min: 2, max: 8 })
    .withMessage("'key' must be 2-8 characters in length.")
    .isAlpha()
    .withMessage("'key' can only contain letters.")
    .isLowercase()
    .withMessage("Letters in 'key' must be lowercase."),
  check('name')
    .exists()
    .withMessage("'name' must be specified in request body.")
    .trim()
    .isLength({ min: 2 })
    .withMessage("'name' must be 2 or more characters long."),
  check(['description', 'collaborationLink', 'tags']),
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
  listProjectsForUser,
  getProjectByKey,
  createProject,
  createOrUpdateProject,
  deleteProjectByKey,
  projectKeyIsUnique,
  actionWithKeyValidator,
  projectDocumentValidator,
  urlAndBodyProjectKeyMatchValidator,
};
