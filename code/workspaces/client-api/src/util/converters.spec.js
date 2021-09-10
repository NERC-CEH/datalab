import { convertIdsToNames, replaceFields } from './converters';
import usersService from '../dataaccess/usersService';

jest.mock('../dataaccess/usersService');

const getUserNameMock = jest.fn();
const token = 'token';

usersService.getUserName = getUserNameMock;

describe('converters', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('convertIdsToNames', () => {
    it('returns the original object if there is no users field', async () => {
      const input = {
        field: 'field',
      };

      const response = await convertIdsToNames(input, token);
      expect(response).toEqual(input);
      expect(getUserNameMock).toHaveBeenCalledTimes(0);
    });

    it('converts all user IDs to user names', async () => {
      getUserNameMock
        .mockResolvedValueOnce('name1')
        .mockResolvedValueOnce('name2');

      const input = {
        field: 'field',
        users: ['id1', 'id2'],
      };
      const expected = {
        field: 'field',
        users: ['name1', 'name2'],
      };

      const response = await convertIdsToNames(input, token);
      expect(response).toEqual(expected);
      expect(getUserNameMock).toHaveBeenCalledTimes(2);
      expect(getUserNameMock).toHaveBeenCalledWith('id1', token);
      expect(getUserNameMock).toHaveBeenCalledWith('id2', token);
    });
  });

  describe('replaceFields', () => {
    it('converts an array of responses', async () => {
      getUserNameMock
        .mockResolvedValueOnce('name1')
        .mockResolvedValueOnce('name1')
        .mockResolvedValueOnce('name2');

      const fnResponse = [
        {
          field: 'field',
          users: ['id1'],
        },
        {
          field: 'field',
          users: ['id1', 'id2'],
        },
      ];
      const fn = Promise.resolve(fnResponse);

      const expected = [
        {
          field: 'field',
          users: ['name1'],
        },
        {
          field: 'field',
          users: ['name1', 'name2'],
        },
      ];

      const replaced = await replaceFields(fn, token);
      expect(replaced).toEqual(expected);
      expect(getUserNameMock).toHaveBeenCalledTimes(3);
    });

    it('converts a single response', async () => {
      getUserNameMock
        .mockResolvedValueOnce('name1')
        .mockResolvedValueOnce('name2');

      const fnResponse = {
        field: 'field',
        users: ['id1', 'id2'],
      };
      const fn = Promise.resolve(fnResponse);

      const expected = {
        field: 'field',
        users: ['name1', 'name2'],
      };

      const replaced = await replaceFields(fn, token);
      expect(replaced).toEqual(expected);
      expect(getUserNameMock).toHaveBeenCalledTimes(2);
    });
  });
});
