import httpMocks from 'node-mocks-http';
import { ANALYSIS, PUBLISH } from 'common/src/stackTypes';
import userResourcesController from './userResourcesController';
import dataStorageRepository from '../dataaccess/dataStorageRepository';
import stacksRepository from '../dataaccess/stacksRepository';

jest.mock('../dataaccess/dataStorageRepository');
jest.mock('../dataaccess/stacksRepository');

const getAllActiveByUserMock = jest.fn();
dataStorageRepository.getAllActiveByUser = getAllActiveByUserMock;

const getAllOwnedMock = jest.fn();
stacksRepository.getAllOwned = getAllOwnedMock;

const createNext = () => {
  let error;

  return {
    handler: (err) => { error = err; },
    getError: () => error,
    resetError: () => { error = undefined; },
  };
};
const next = createNext();

describe('userResourcesController', () => {
  it('listUserResources lists resources', async () => {
    // Arrange
    const request = httpMocks.createRequest({
      method: 'GET',
      body: {
        userId: 'user-1234',
      },
    });
    userResourcesController.userIdValidator(request, () => { }, () => { });
    const response = httpMocks.createResponse();
    getAllActiveByUserMock.mockResolvedValue([
      { projectKey: 'project-99', name: 'storage-99', other: 'stuff' },
    ]);
    getAllOwnedMock.mockResolvedValue([
      { category: ANALYSIS, projectKey: 'project-99', name: 'notebook-99', other: 'stuff' },
      { category: PUBLISH, projectKey: 'project-99', name: 'site-99', other: 'stuff' },
    ]);

    // Act
    await userResourcesController.listUserResources(request, response, next.handler);

    // Assert
    expect(response.statusCode).toBe(200);
    // eslint-disable-next-line no-underscore-dangle
    expect(response._getData()).toEqual({
      notebookOwner: [{ projectKey: 'project-99', name: 'notebook-99' }],
      siteOwner: [{ projectKey: 'project-99', name: 'site-99' }],
      storageAccess: [{ projectKey: 'project-99', name: 'storage-99' }],
    });
  });
});

