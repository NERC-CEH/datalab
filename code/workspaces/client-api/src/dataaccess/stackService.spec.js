import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import stackService from './stackService';

const httpMock = new MockAdapter(axios);

const testStack = { id: '1234', name: 'Stack 1' };

const testStacks = [
  testStack,
  { id: '4321', name: 'Stack 2' },
];

const context = { token: 'token' };

describe('stackService', () => {
  beforeEach(() => {
    httpMock.reset();
  });

  afterAll(() => {
    httpMock.restore();
  });

  it('getAll makes an api request', () => {
    httpMock.onGet('http://localhost:8003/stacks')
      .reply(200, testStacks);

    return stackService.getAll(context)
      .then(response => expect(response).toEqual(testStacks));
  });

  it('getAllByCategory makes an api request', () => {
    httpMock.onGet('http://localhost:8003/stacks/category/expectedCategory')
      .reply(200, testStacks);

    return stackService.getAllByCategory(context, 'expectedCategory')
      .then(response => expect(response).toEqual(testStacks));
  });

  it('getByName makes an api request', () => {
    httpMock.onGet('http://localhost:8003/stack/name/expectedName')
      .reply(200, testStack);

    return stackService.getByName(context, 'expectedName')
      .then(response => expect(response).toBe('1234'));
  });

  it('getByName empty response returns null', () => {
    httpMock.onGet('http://localhost:8003/stack/name/expectedName')
      .reply(201);

    return stackService.getByName(context, 'expectedName')
      .then(response => expect(response).toBe(null));
  });

  it('getById makes an api request', () => {
    httpMock.onGet('http://localhost:8003/stack/id/abcd1234efgh4321')
      .reply(200, testStack);

    return stackService.getById(context, 'abcd1234efgh4321')
      .then(response => expect(response).toEqual(testStack));
  });

  it('createStack makes an api request', () => {
    httpMock.onPost('http://localhost:8003/stack')
      .reply(200, testStack);

    return stackService.createStack(context, 'stack')
      .then(response => expect(response).toEqual(testStack));
  });

  it('deleteStack makes an api request', () => {
    httpMock.onDelete('http://localhost:8003/stack')
      .reply(200);

    return stackService.deleteStack(context, 'stack')
      .then(() => expect(true).toBe(true));
  });
});