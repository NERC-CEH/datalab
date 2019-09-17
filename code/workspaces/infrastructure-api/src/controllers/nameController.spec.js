import * as validator from 'express-validator';
import httpMocks from 'node-mocks-http';
import stackRepository from '../dataaccess/stacksRepository';
import dataStorageRepository from '../dataaccess/dataStorageRepository';
import nameController from './nameController';

jest.mock('../dataaccess/stacksRepository');
jest.mock('../dataaccess/dataStorageRepository');
jest.mock('express-validator');

const getOneByNameMock = jest.fn();
const getAllByNameMock = jest.fn();
const matchedDataMock = jest.fn();

dataStorageRepository.getAllByName = getAllByNameMock;
stackRepository.getOneByName = getOneByNameMock;
validator.matchedData = matchedDataMock;

const response = httpMocks.createResponse();
const request = httpMocks.createRequest();
matchedDataMock.mockReturnValue({ name: 'name' });

describe('name controller', () => {
  beforeEach(() => {
    getOneByNameMock.mockReset();
    getAllByNameMock.mockReset();
  });

  it('should return unique if no matches', async () => {
    getOneByNameMock.mockReturnValue(Promise.resolve(undefined));
    getAllByNameMock.mockReturnValue(Promise.resolve(undefined));

    await nameController.isUnique(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getData()).toEqual({ isUnique: true }); // eslint-disable-line no-underscore-dangle
  });

  it('should return not unique if stack matches', async () => {
    getOneByNameMock.mockReturnValue(Promise.resolve(undefined));
    getAllByNameMock.mockReturnValue(Promise.resolve('stack'));

    await nameController.isUnique(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getData()).toEqual({ isUnique: false }); // eslint-disable-line no-underscore-dangle
  });

  it('should return not unique if data storage matches', async () => {
    getOneByNameMock.mockReturnValue(Promise.resolve('storage'));
    getAllByNameMock.mockReturnValue(Promise.resolve(undefined));

    await nameController.isUnique(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getData()).toEqual({ isUnique: false }); // eslint-disable-line no-underscore-dangle
  });
});
