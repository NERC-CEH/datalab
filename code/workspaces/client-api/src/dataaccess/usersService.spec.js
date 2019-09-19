import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import config from '../config';
import usersService from './usersService';

const AUTH_URL_BASE = config.get('authorisationService');
const httpMock = new MockAdapter(axios);

const testUsers = [
  { name: 'user one', userId: 'one' },
  { name: 'user two', userId: 'two' },
];

const context = { token: 'token' };

describe('userService', () => {
  beforeEach(() => {
    httpMock.reset();
  });

  afterAll(() => {
    httpMock.restore();
  });

  it('getAll makes an api request', () => {
    httpMock.onGet(`${AUTH_URL_BASE}/users`)
      .reply(200, testUsers);

    return usersService.getAll(context)
      .then(response => expect(response).toEqual(testUsers));
  });

  it('isMemberOfProject makes an api request', () => {
    httpMock.onGet(`${AUTH_URL_BASE}/projects/project2/is-member`)
      .reply(200, true);

    return usersService.isMemberOfProject('project2', context)
      .then(response => expect(response).toEqual(true));
  });
});
