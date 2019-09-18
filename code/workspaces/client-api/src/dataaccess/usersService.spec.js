import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import usersService from './usersService';

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
    httpMock.onGet('http://localhost:9000/users')
      .reply(200, testUsers);

    return usersService.getAll(context)
      .then(response => expect(response).toEqual(testUsers));
  });

  it('isMemberOfProject makes an api request', () => {
    httpMock.onGet('http://localhost:9000/projects/project2/is-member')
      .reply(200, true);

    return usersService.isMemberOfProject('project2', context)
      .then(response => expect(response).toEqual(true));
  });
});
