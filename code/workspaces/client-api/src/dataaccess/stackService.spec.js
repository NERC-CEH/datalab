import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import stackService from './stackService';

const httpMock = new MockAdapter(axios);

const testStack = { id: '1234', name: 'Stack 1' };

const testStacks = [
  testStack,
  { id: '4321', name: 'Stack 2' },
];

const updateMessage = { modified: 1 };

const context = { token: 'token' };
const PROJECT_KEY = 'project';

describe('stackService', () => {
  beforeEach(() => {
    httpMock.reset();
  });

  afterAll(() => {
    httpMock.restore();
  });

  it('getAll makes an api request', () => {
    httpMock.onGet('http://localhost:8003/stacks/project')
      .reply(200, testStacks);

    return stackService.getAll(PROJECT_KEY, context)
      .then(response => expect(response).toEqual(testStacks));
  });

  it('getAllByCategory makes an api request', () => {
    httpMock.onGet('http://localhost:8003/stacks/project/category/expectedCategory')
      .reply(200, testStacks);

    return stackService.getAllByCategory(PROJECT_KEY, 'expectedCategory', context)
      .then(response => expect(response).toEqual(testStacks));
  });

  it('getByName makes an api request', () => {
    httpMock.onGet('http://localhost:8003/stack/project/name/expectedName')
      .reply(200, testStack);

    return stackService.getByName(PROJECT_KEY, 'expectedName', context)
      .then(response => expect(response).toBe('1234'));
  });

  it('getByName empty response returns null', () => {
    httpMock.onGet('http://localhost:8003/stack/project/name/expectedName')
      .reply(201);

    return stackService.getByName(PROJECT_KEY, 'expectedName', context)
      .then(response => expect(response).toBe(null));
  });

  it('getById makes an api request', () => {
    httpMock.onGet('http://localhost:8003/stack/project/id/abcd1234efgh4321')
      .reply(200, testStack);

    return stackService.getById(PROJECT_KEY, 'abcd1234efgh4321', context)
      .then(response => expect(response).toEqual(testStack));
  });

  it('createStack makes an api request', () => {
    httpMock.onPost('http://localhost:8003/stack/project')
      .reply(200, testStack);

    return stackService.createStack('project', 'stack', context)
      .then(response => expect(response).toEqual(testStack));
  });

  it('updateStack makes an api request', () => {
    httpMock.onPut('http://localhost:8003/stack/project')
      .reply(200, updateMessage);

    return stackService.updateStack('project', 'stack', context)
      .then(response => expect(response).toEqual(updateMessage));
  });

  it('deleteStack makes an api request', () => {
    httpMock.onDelete('http://localhost:8003/stack/project')
      .reply(200);

    return stackService.deleteStack('project', 'stack', context)
      .then(() => expect(true).toBe(true));
  });
});
