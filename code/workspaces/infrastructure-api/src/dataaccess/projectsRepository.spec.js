import projectsRepository from './projectsRepository';
import database from '../config/database';
import centralAssetRepoRepository from './centralAssetRepoRepository';

jest.mock('../config/database');

jest.mock('./centralAssetRepoRepository');
centralAssetRepoRepository.deleteProject = jest.fn();

const testProject = {
  key: 'key',
  name: 'name',
  description: 'description',
  collaborationLink: 'collaborationLink',
};

const ProjectMock = {};
const methods = ['find', 'findOne', 'findOneAndUpdate', 'exec', 'exists', 'create', 'deleteOne', 'where', 'in'];
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

  it('getProjectsWithIds calls correct methods with correct arguments', async () => {
    await projectsRepository.getProjectsWithIds(['id1']);
    expectToHaveBeenCalledOnceWith(ProjectMock.find);
    expectToHaveBeenCalledOnceWith(ProjectMock.where, 'key');
    expectToHaveBeenCalledOnceWith(ProjectMock.in, ['id1']);
    expectToHaveBeenCalledOnceWith(ProjectMock.exec);
  });

  it('getByKey calls correct methods with correct arguments', async () => {
    const key = 'expected-key';
    await projectsRepository.getByKey(key);
    expectToHaveBeenCalledOnceWith(ProjectMock.findOne, { key });
    expectToHaveBeenCalledOnceWith(ProjectMock.exec);
  });

  it('exists calls correct methods with correct arguments', async () => {
    const { key } = testProject;
    await projectsRepository.exists(key);
    expectToHaveBeenCalledOnceWith(ProjectMock.exists, { key });
  });

  it('create calls correct methods with correct arguments', async () => {
    await projectsRepository.create(testProject);
    expectToHaveBeenCalledOnceWith(ProjectMock.create, [testProject], { setDefaultsOnInsert: true });
  });

  it('createOrUpdate calls correct methods with correct arguments', async () => {
    await projectsRepository.createOrUpdate(testProject);
    expectToHaveBeenCalledOnceWith(
      ProjectMock.findOneAndUpdate,
      { key: testProject.key },
      testProject,
      { upsert: true, setDefaultsOnInsert: true, new: true, omitUndefined: true },
    );
  });

  it('deleteByKey calls correct methods with correct arguments', async () => {
    const { key } = testProject;
    await projectsRepository.deleteByKey(key);
    expectToHaveBeenCalledOnceWith(centralAssetRepoRepository.deleteProject, key);
    expectToHaveBeenCalledOnceWith(ProjectMock.deleteOne, { key });
    expectToHaveBeenCalledOnceWith(ProjectMock.exec);
  });
});

function expectToHaveBeenCalledOnceWith(mockFn, ...args) {
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(mockFn).toHaveBeenCalledWith(...args);
}
