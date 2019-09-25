import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import config from '../config';
import projectService, { projectActionRequestToProject } from './projectService';

const httpMock = new MockAdapter(axios);
const token = 'token';

const testProject = {
  key: 'test-key',
  name: 'Test Name',
  description: 'Test description',
  collaborationLink: 'test-link',
};

const testProjects = [
  testProject,
  { key: 'key-1', name: 'name 1', description: 'description 1' },
  { key: 'key-2', name: 'name 2', description: 'description 2' },
];

const infraServiceUrl = config.get('infrastructureApi');

describe('projectService', () => {
  beforeEach(() => {
    httpMock.reset();
  });

  afterAll(() => {
    httpMock.restore();
  });

  it('listProjects makes an api call and returns response data', async () => {
    httpMock.onGet(`${infraServiceUrl}/projects`)
      .reply(200, testProjects);

    const result = await projectService.listProjects(token);
    expect(result).toEqual(testProjects);
  });

  it('getProjectByKey makes an api call and returns response data', async () => {
    const { key } = testProject;
    httpMock.onGet(`${infraServiceUrl}/projects/${key}`)
      .reply(200, testProject);

    const result = await projectService.getProjectByKey(key, token);
    expect(result).toEqual(testProject);
  });

  it('isProjectKeyUnique makes an api call and returns response data', async () => {
    const { key } = testProject;
    httpMock.onGet(`${infraServiceUrl}/projects/${key}/isunique`)
      .reply(200, true);

    const result = await projectService.isProjectKeyUnique(key, token);
    expect(result).toEqual(true);
  });

  it('createProject makes an api call and returns the response data', async () => {
    const dummyResponse = { id: 'id', ...testProject };
    httpMock.onPost(`${infraServiceUrl}/projects`, testProject)
      .reply(200, dummyResponse);

    const creationRequest = { ...testProject, projectKey: testProject.key };
    delete creationRequest.key;
    const result = await projectService.createProject(creationRequest, token);
    expect(result).toEqual(dummyResponse);
  });

  it('updateProject makes an api call and returns the response data', async () => {
    const { key } = testProject;
    const dummyResponse = { id: 'id', ...testProject };
    httpMock.onPut(`${infraServiceUrl}/projects/${key}`, testProject)
      .reply(200, dummyResponse);

    const updateRequest = { ...testProject, projectKey: testProject.key };
    delete updateRequest.key;
    const result = await projectService.updateProject(updateRequest, token);
    expect(result).toEqual(dummyResponse);
  });

  it('deleteProject makes an api call and returns the response data', async () => {
    const { key } = testProject;
    httpMock.onDelete(`${infraServiceUrl}/projects/${key}`)
      .reply(200, true);

    const result = await projectService.deleteProject(key, token);
    expect(result).toEqual(true);
  });
});

describe('projectActionRequestToProject', () => {
  it('converts action request to a project definition', () => {
    const projectKey = 'projectKey';
    const baseData = { name: 'name', description: 'description', collaborationLink: 'collaborationLink' };
    const actionRequest = { projectKey, ...baseData };
    const projcetDefinition = { key: projectKey, ...baseData };
    expect(projectActionRequestToProject(actionRequest)).toEqual(projcetDefinition);
  });
});
