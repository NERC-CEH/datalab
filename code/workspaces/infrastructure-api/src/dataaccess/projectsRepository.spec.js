import projectsRepository from './projectsRepository';
import database from '../config/database';

jest.mock('../config/database');

const testDocument = {
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
    expect(ProjectMock.find).toHaveBeenCalledTimes(1);
    expect(ProjectMock.find).toHaveBeenCalledWith();
    expect(ProjectMock.exec).toHaveBeenCalledTimes(1);
    expect(ProjectMock.exec).toHaveBeenCalledWith();
  });

  it('getByKey calls correct methods with correct arguments', async () => {
    const key = 'expected-key';
    await projectsRepository.getByKey(key);
    expect(ProjectMock.findOne).toHaveBeenCalledTimes(1);
    expect(ProjectMock.findOne).toHaveBeenCalledWith({ projectKey: key });
    expect(ProjectMock.exec).toHaveBeenCalledTimes(1);
    expect(ProjectMock.exec).toHaveBeenCalledWith();
  });

  it('exists calls correct methods with correct arguments', async () => {
    await projectsRepository.exists(testDocument);
    expect(ProjectMock.exists).toHaveBeenCalledTimes(1);
    expect(ProjectMock.exists).toHaveBeenCalledWith({ projectKey: testDocument.projectKey });
  });

  it('create calls correct methods with correct arguments', async () => {
    await projectsRepository.create(testDocument);
    expect(ProjectMock.create).toHaveBeenCalledTimes(1);
    expect(ProjectMock.create).toHaveBeenCalledWith(testDocument);
  });

  it('createOrUpdate calls correct methods with correct arguments', async () => {
    await projectsRepository.createOrUpdate(testDocument);
    expect(ProjectMock.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(ProjectMock.findOneAndUpdate).toHaveBeenCalledWith(
      { projectKey: testDocument.projectKey },
      testDocument,
      { upsert: true, setDefaultsOnInsert: true },
    );
  });

  it('deleteByKey calls correct methods with correct arguments', async () => {
    await projectsRepository.deleteByKey(testDocument.projectKey);
    expect(ProjectMock.remove).toHaveBeenCalledTimes(1);
    expect(ProjectMock.remove).toHaveBeenCalledWith({ projectKey: testDocument.projectKey });
    expect(ProjectMock.exec).toHaveBeenCalledTimes(1);
    expect(ProjectMock.exec).toHaveBeenCalledWith();
  });
});
