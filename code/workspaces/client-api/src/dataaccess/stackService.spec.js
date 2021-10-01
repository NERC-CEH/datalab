import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import stackService from './stackService';

const httpMock = new MockAdapter(axios);

const PROJECT_KEY = 'project';
const testStack = { id: '1234', name: 'Stack 1', projectKey: PROJECT_KEY };

const testStacks = [
  testStack,
  { id: '4321', name: 'Stack 2' },
];

const updateMessage = { modified: 1 };

const context = { token: 'token' };
const responseMessage = { message: 'ok' };

describe('stackService', () => {
  beforeEach(() => {
    httpMock.reset();
  });

  afterAll(() => {
    httpMock.restore();
  });

  it('getAll makes an api request', async () => {
    httpMock.onGet('http://localhost:8003/stacks/project').reply(200, testStacks);

    const response = await stackService.getAll(PROJECT_KEY, context);
    expect(response).toEqual(testStacks);
  });

  it('getAllByCategory makes an api request', async () => {
    httpMock.onGet('http://localhost:8003/stacks/project/category/expectedCategory').reply(200, testStacks);

    const response = await stackService.getAllByCategory(PROJECT_KEY, 'expectedCategory', context);
    expect(response).toEqual(testStacks);
  });

  it('getByName makes an api request', async () => {
    httpMock.onGet('http://localhost:8003/stack/project/name/expectedName').reply(200, testStack);

    const response = await stackService.getByName(PROJECT_KEY, 'expectedName', context);
    expect(response).toBe('1234');
  });

  it('getByName empty response returns null', async () => {
    httpMock.onGet('http://localhost:8003/stack/project/name/expectedName').reply(201);

    const response = await stackService.getByName(PROJECT_KEY, 'expectedName', context);
    expect(response).toBe(null);
  });

  it('getById makes an api request', async () => {
    httpMock.onGet('http://localhost:8003/stack/project/id/abcd1234efgh4321').reply(200, testStack);

    const response = await stackService.getById(PROJECT_KEY, 'abcd1234efgh4321', context);
    expect(response).toEqual(testStack);
  });

  it('createStack makes an api request', async () => {
    httpMock.onPost('http://localhost:8003/stack/project').reply(200, testStack);

    const response = await stackService.createStack('project', 'stack', context);
    expect(response).toEqual(testStack);
  });

  it('updateStack makes an api request', async () => {
    httpMock.onPut('http://localhost:8003/stack/project').reply(200, updateMessage);

    const response = await stackService.updateStack('project', 'stack', context);
    expect(response).toEqual(updateMessage);
  });

  it('deleteStack makes an api request', async () => {
    httpMock.onDelete('http://localhost:8003/stack/project').reply(200, responseMessage);

    const res = await stackService.deleteStack('project', 'stack', context);
    expect(res).toEqual(responseMessage);
  });

  it('restartStack makes an api request', async () => {
    httpMock.onPut('http://localhost:8003/stack/project/restart').reply(200, responseMessage);

    const response = await stackService.restartStack('project', testStack, context);
    expect(response).toEqual(responseMessage);
  });

  it('scaleupStack makes an api request', async () => {
    httpMock.onPut('http://localhost:8003/stack/project/scaleup').reply(200, responseMessage);

    const response = await stackService.scaleUpStack('project', testStack, context);
    expect(response).toEqual(responseMessage);
  });

  it('scaledownStack makes an api request', async () => {
    httpMock.onPut('http://localhost:8003/stack/project/scaledown').reply(200, responseMessage);

    const response = await stackService.scaleDownStack('project', testStack, context);
    expect(response).toEqual(responseMessage);
  });
});
