import httpMocks from 'node-mocks-http';
import { ANALYSIS, PUBLISH } from 'common/src/stackTypes';
import resourcesController from './resourcesController';
import dataStorageRepository from '../dataaccess/dataStorageRepository';
import stacksRepository from '../dataaccess/stacksRepository';
import projectsRepository from '../dataaccess/projectsRepository';
import clustersRepository from '../dataaccess/clustersRepository';

jest.mock('../dataaccess/dataStorageRepository');
jest.mock('../dataaccess/stacksRepository');
jest.mock('../dataaccess/projectsRepository');
jest.mock('../dataaccess/clustersRepository');

const getAllStorageMock = jest.fn();
dataStorageRepository.getAllActive = getAllStorageMock;

const getAllStacksMock = jest.fn();
stacksRepository.getAllStacks = getAllStacksMock;

const getAllProjectsMock = jest.fn();
projectsRepository.getAll = getAllProjectsMock;

const getAllClustersMock = jest.fn();
clustersRepository.getAll = getAllClustersMock;

const createNext = () => {
  let error;

  return {
    handler: (err) => { error = err; },
    getError: () => error,
    resetError: () => { error = undefined; },
  };
};
const next = createNext();

const projects = [
  { key: 'project-99', name: 'test project' },
  { name: 'no key' },
];
const storage = [
  { projectKey: 'project-99', name: 'storage-99' },
  { name: 'no key' },
];
const stacks = [
  { category: ANALYSIS, projectKey: 'project-99', name: 'notebook-99' },
  { category: PUBLISH, projectKey: 'project-99', name: 'site-99' },
  { name: 'no key' },
];
const clusters = [
  { projectKey: 'project-99', name: 'cluster-99' },
  { name: 'no key' },
];

describe('userResourcesController', () => {
  it('getAllProjectsAndResources gets all project resources', async () => {
    // Arrange
    const request = httpMocks.createRequest({
      method: 'GET',
    });
    const response = httpMocks.createResponse();
    getAllProjectsMock.mockResolvedValue(projects);
    getAllStorageMock.mockResolvedValue(storage);
    getAllStacksMock.mockResolvedValue(stacks);
    getAllClustersMock.mockResolvedValue(clusters);

    // Act
    await resourcesController.getAllProjectsAndResources(request, response, next.handler);

    // Assert
    expect(response.statusCode).toBe(200);
    // eslint-disable-next-line no-underscore-dangle
    expect(response._getData()).toEqual({
      projects,
      storage,
      stacks,
      clusters,
    });
  });
});

