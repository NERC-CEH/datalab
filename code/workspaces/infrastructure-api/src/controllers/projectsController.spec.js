import * as validator from 'express-validator';
import projectsRepository from '../dataaccess/projectsRepository';
import projectsController from './projectsController';

jest.mock('express-validator');
jest.mock('../dataaccess/projectsRepository');

const responseMock = {};
const responseMethods = ['send', 'status'];
responseMethods.forEach((method) => {
  responseMock[method] = jest.fn(() => responseMock);
});

const nextMock = jest.fn();

const throwErrorMock = jest.fn(() => { throw new Error('expected error message text'); });

validator.matchedData = jest.fn((request, options) => (
  options && options.locations
    ? request[options.locations[0]]
    : request
));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('listProjects', () => {
  it('returns the array of projects returned from the database', async () => {
    const databaseProjects = [
      { key: 'project-one', name: 'Project One' },
      { key: 'project-two', name: 'Project Two' },
    ];
    projectsRepository.getAll = jest.fn(() => databaseProjects);

    await projectsController.listProjects({}, responseMock, nextMock);
    expectToBeCalledOnceWith(responseMock.send, databaseProjects);
  });

  it('calls next with error if error thrown getting data from database and does not call send', async () => {
    projectsRepository.getAll = throwErrorMock;
    await projectsController.listProjects({}, responseMock, nextMock);
    checkNextCalledWithErrorAndSendNotCalled(nextMock, responseMock);
  });
});

describe('getProjectByKey', () => {
  it('uses matchedData key to get by key', async () => {
    projectsRepository.getByKey = jest.fn();
    await projectsController.getProjectByKey({ projectKey: 'expected-key' }, responseMock, nextMock);
    expectToBeCalledOnceWith(projectsRepository.getByKey, 'expected-key');
  });

  it('returns project if it exists', async () => {
    const dummyProject = { projectKey: 'projectKey', name: 'name' };
    projectsRepository.getByKey = jest.fn(() => dummyProject);
    await projectsController.getProjectByKey({ projectKey: 'some-key' }, responseMock, nextMock);
    expectToBeCalledOnceWith(responseMock.send, dummyProject);
  });

  it('returns a 404 if project not found', async () => {
    projectsRepository.getByKey = jest.fn(() => undefined);
    await projectsController.getProjectByKey({ projectKey: 'some-key' }, responseMock, nextMock);
    expectToBeCalledOnceWith(responseMock.status, 404);
    expectToBeCalledOnceWith(responseMock.send);
  });

  it('calls next with an error if error thrown while retrieving data and does not call send', async () => {
    projectsRepository.getByKey = throwErrorMock;
    await projectsController.getProjectByKey({ key: 'some-key' }, responseMock, nextMock);
    checkNextCalledWithErrorAndSendNotCalled(nextMock, responseMock);
  });
});

describe('createProject', () => {
  const dummyProject = {
    key: 'projectKey',
    name: 'name',
    description: 'description',
    collaborationLink: 'collaborationLink',
  };

  it('takes the document definition from the request body and checks if it exists', async () => {
    projectsRepository.exists = jest.fn();
    await projectsController.createProject({ body: dummyProject }, responseMock, nextMock);
    expectToBeCalledOnceWith(projectsRepository.exists, dummyProject.key);
  });

  it('returns 400 if a project with the same key already exists', async () => {
    projectsRepository.exists = jest.fn(() => true);
    await projectsController.createProject({ body: dummyProject }, responseMock, nextMock);
    expectToBeCalledOnceWith(responseMock.status, 400);
    expect(responseMock.send.mock.calls[0][0]).toMatchSnapshot();
  });

  it('it creates document, returns 201 and returns created document when project does not exist', async () => {
    projectsRepository.exists = jest.fn(() => false);
    projectsRepository.create = jest.fn(document => ([{ ...document, id: 'database-id' }]));
    await projectsController.createProject({ body: dummyProject }, responseMock, nextMock);

    expectToBeCalledOnceWith(projectsRepository.create, dummyProject);
    expectToBeCalledOnceWith(responseMock.status, 201);
    expectToBeCalledOnceWith(responseMock.send, { ...dummyProject, id: 'database-id' });
  });

  it('calls next with an error if error thrown while creating data and does not call send', async () => {
    projectsRepository.create = throwErrorMock;
    await projectsController.createProject({ body: dummyProject }, responseMock, nextMock);
    checkNextCalledWithErrorAndSendNotCalled(nextMock, responseMock);
  });
});

describe('createOrUpdateProject', () => {
  const dummyProject = {
    key: 'key',
    name: 'name',
    description: 'description',
    collaborationLink: 'collaborationLink',
  };
  const dummyDatabaseDocument = {
    ...dummyProject,
    id: 'database-id',
  };
  const requestMock = { params: { projectKey: dummyProject.key }, body: dummyProject };

  it('returns 201 and project document when creating document', async () => {
    projectsRepository.createOrUpdate = jest.fn(() => dummyDatabaseDocument);
    projectsRepository.exists = jest.fn(() => false);

    await projectsController.createOrUpdateProject(requestMock, responseMock, nextMock);

    expectToBeCalledOnceWith(projectsRepository.createOrUpdate, dummyProject);
    expectToBeCalledOnceWith(responseMock.status, 201);
    expectToBeCalledOnceWith(responseMock.send, dummyDatabaseDocument);
  });

  it('returns 200 and updated project document when updating document', async () => {
    projectsRepository.createOrUpdate = jest.fn(() => dummyDatabaseDocument);
    projectsRepository.exists = jest.fn(() => true);

    await projectsController.createOrUpdateProject(requestMock, responseMock, nextMock);

    expectToBeCalledOnceWith(projectsRepository.createOrUpdate, dummyProject);
    expectToBeCalledOnceWith(responseMock.status, 200);
    expectToBeCalledOnceWith(responseMock.send, dummyDatabaseDocument);
  });

  it('calls next with an error if error thrown while creating data and does not call send', async () => {
    projectsRepository.createOrUpdate = throwErrorMock;
    await projectsController.createOrUpdateProject(requestMock, responseMock, nextMock);
    checkNextCalledWithErrorAndSendNotCalled(nextMock, responseMock);
  });
});

describe('deleteProjectByKey', () => {
  const requestMock = { projectKey: 'projectKey' };

  it('calls deleteByKey with correct key', async () => {
    projectsRepository.deleteByKey = jest.fn();
    await projectsController.deleteProjectByKey(requestMock, responseMock, nextMock);
    expectToBeCalledOnceWith(projectsRepository.deleteByKey, requestMock.projectKey);
  });

  it('returns 404 and false if it found no documents to delete', async () => {
    projectsRepository.deleteByKey = jest.fn(() => ({ n: 0 }));

    await projectsController.deleteProjectByKey(requestMock, responseMock, nextMock);
    expectToBeCalledOnceWith(responseMock.status, 404);
    expectToBeCalledOnceWith(responseMock.send, false);
  });

  it('returns true if document found and deleted', async () => {
    const deletionResult = { n: 1 };
    projectsRepository.deleteByKey = jest.fn(() => deletionResult);

    await projectsController.deleteProjectByKey(requestMock, responseMock, nextMock);
    expectToBeCalledOnceWith(responseMock.send, true);
  });

  it('calls next with an error if error thrown while creating data and does not call send', async () => {
    projectsRepository.deleteByKey = throwErrorMock;
    await projectsController.deleteProjectByKey(requestMock, responseMock, nextMock);
    checkNextCalledWithErrorAndSendNotCalled(nextMock, responseMock);
  });
});

describe('projectKeyIsUnique', () => {
  const requestMock = { projectKey: 'projectKey' };

  it('returns true when project with key does not exist', async () => {
    projectsRepository.exists = jest.fn(() => false);
    await projectsController.projectKeyIsUnique(requestMock, responseMock, nextMock);
    expectToBeCalledOnceWith(responseMock.send, true);
  });

  it('returns false when project with key exists', async () => {
    projectsRepository.exists = jest.fn(() => true);
    await projectsController.projectKeyIsUnique(requestMock, responseMock, nextMock);
    expectToBeCalledOnceWith(responseMock.send, false);
  });

  it('calls next with an error if error thrown while checking existence and does not call send', async () => {
    projectsRepository.exists = throwErrorMock;
    await projectsController.projectKeyIsUnique(requestMock, responseMock, nextMock);
    checkNextCalledWithErrorAndSendNotCalled(nextMock, responseMock);
  });
});

function expectToBeCalledOnceWith(mockFn, ...args) {
  expect(mockFn).toBeCalledTimes(1);
  expect(mockFn).toBeCalledWith(...args);
}

function checkNextCalledWithErrorAndSendNotCalled(mockNext, mockResponse) {
  expect(mockNext).toHaveBeenCalledTimes(1);
  expect(mockNext.mock.calls[0].length).toEqual(1);
  expect(mockNext.mock.calls[0][0]).toMatchSnapshot();
  expect(mockResponse.send).toHaveBeenCalledTimes(0);
}
