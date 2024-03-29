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

const user = {
  sub: 'username',
};

const infraServiceUrl = config.get('infrastructureApi');
const authServiceUrl = `${config.get('authorisationService')}`;

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

  it('listProjectsForUser makes an api call and returns response data', async () => {
    httpMock.onGet(`${infraServiceUrl}/projects/forUser`)
      .reply(200, testProjects);

    const result = await projectService.listProjectsForUser(token);
    expect(result).toEqual(testProjects);
  });

  it('getAllProjectsAndResources makes an api call and returns response data', async () => {
    httpMock.onGet(`${infraServiceUrl}/resources`)
      .reply(200, testProjects);

    const result = await projectService.getAllProjectsAndResources(token);
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
    const dummyAuthResponse = { userId: user.sub, projectKey: testProject.key, role: 'admin' };

    httpMock.onPost(`${infraServiceUrl}/projects`, testProject)
      .reply(200, dummyResponse);
    httpMock.onPut(`${authServiceUrl}/projects/${testProject.key}/users/${user.sub}/roles`, { role: 'admin' })
      .reply(200, dummyAuthResponse);

    const creationRequest = { ...testProject, projectKey: testProject.key };
    delete creationRequest.key;
    const result = await projectService.createProject(creationRequest, user, { userName: 'user1' }, token);
    expect(result).toEqual(dummyResponse);
  });

  it('requestProject makes an api call and returns', async () => {
    const requestedProject = {
      name: 'Test Name',
      description: 'Test description',
      collaborationLink: 'test-link',
      key: 'test-key',
      owner: 'username',
    };

    const expectedProjectNotification = {
      title: 'New Project Request',
      message: JSON.stringify(requestedProject, null, 2),
      userIDs: 'username',
    };

    // this is actually the assert as there is no return from this method, it fails if the wrong body is sent
    httpMock.onPost(`${infraServiceUrl}/notifications`, expectedProjectNotification).reply(200);

    const creationRequest = { ...testProject, projectKey: testProject.key };
    delete creationRequest.key;

    await projectService.requestProject(creationRequest, user, { userName: 'user1' }, token);
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

  it('getMultipleProjects makes an api call and returns response data', async () => {
    const { key } = testProject;
    httpMock.onGet(`${infraServiceUrl}/projects/${key}`)
      .reply(200, testProject);

    const result = await projectService.getMultipleProjects([key, 'no-such-key'], token);
    expect(result).toEqual([testProject]);
  });
});

describe('projectActionRequestToProject', () => {
  it('converts action request to a project definition', () => {
    const projectKey = 'projectKey';
    const baseData = { name: 'name', description: 'description', collaborationLink: 'collaborationLink' };
    const actionRequest = { projectKey, ...baseData };
    const projectDefinition = { key: projectKey, ...baseData };
    expect(projectActionRequestToProject(actionRequest)).toEqual(projectDefinition);
  });
});
