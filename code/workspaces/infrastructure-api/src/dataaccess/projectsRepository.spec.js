import projectsRepository from './projectsRepository';
import database from '../config/database';

jest.mock('../config/database');

const testProject = {
  projectKey: 'projectKey',
  name: 'name',
  description: 'description',
  collaborationLink: 'collaborationLink',
};

const ProjectMock = {};
const methods = ['find', 'findOne', 'findOneAndUpdate', 'exec', 'exists', 'create', 'remove'];
methods.forEach((name) => {
  ProjectMock[name] = jest.fn();
  // relies on fact ProjectMock returned by reference and not copied. Allows function chaining.
  ProjectMock[name].mockReturnValue(ProjectMock);
});

database.getModel = () => ProjectMock;

describe('projectsRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAll calls correct methods with correct arguments', async () => {
    await projectsRepository.getAll();
    expectToHaveBeenCalledOnceWith(ProjectMock.find);
    expectToHaveBeenCalledOnceWith(ProjectMock.exec);
  });

  it('getByKey calls correct methods with correct arguments', async () => {
    const projectKey = 'expected-key';
    await projectsRepository.getByKey(projectKey);
    expectToHaveBeenCalledOnceWith(ProjectMock.findOne, { projectKey });
    expectToHaveBeenCalledOnceWith(ProjectMock.exec);
  });

  it('exists calls correct methods with correct arguments', async () => {
    const { projectKey } = testProject;
    await projectsRepository.exists(projectKey);
    expectToHaveBeenCalledOnceWith(ProjectMock.exists, { projectKey });
  });

  it('create calls correct methods with correct arguments', async () => {
    await projectsRepository.create(testProject);
    expectToHaveBeenCalledOnceWith(ProjectMock.create, testProject);
  });

  it('createOrUpdate calls correct methods with correct arguments', async () => {
    await projectsRepository.createOrUpdate(testProject);
    expectToHaveBeenCalledOnceWith(
      ProjectMock.findOneAndUpdate,
      { projectKey: testProject.projectKey },
      testProject,
      { upsert: true, setDefaultsOnInsert: true, new: true },
    );
  });

  it('deleteByKey calls correct methods with correct arguments', async () => {
    const { projectKey } = testProject;
    await projectsRepository.deleteByKey(projectKey);
    expectToHaveBeenCalledOnceWith(ProjectMock.remove, { projectKey });
    expectToHaveBeenCalledOnceWith(ProjectMock.exec);
  });
});

function expectToHaveBeenCalledOnceWith(mockFn, ...args) {
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(mockFn).toHaveBeenCalledWith(...args);
}
