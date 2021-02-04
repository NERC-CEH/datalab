import * as expressValidator from 'express-validator';
import centralAssetRepoRepository from '../dataaccess/centralAssetRepoRepository';
import centralAssetRepoController from './centralAssetRepoController';

jest.mock('../dataaccess/centralAssetRepoRepository');

const matchedDataMock = jest
  .spyOn(expressValidator, 'matchedData')
  .mockImplementation(request => request);

const responseMock = {
  status: jest.fn().mockImplementation(() => responseMock),
  send: jest.fn().mockImplementation(() => responseMock),
};
const nextMock = jest.fn();

const getMinimalRequestMock = () => ({
  name: 'Test Metadata',
  version: '0.1.0',
  type: 'DATA',
  owners: [],
  visible: 'public',
  fileLocation: 'path/to/file',
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createAssetMetadata', () => {
  const { createAssetMetadata } = centralAssetRepoController;

  it('calls matched data to get the metadata information', async () => {
    const requestMock = { };
    await createAssetMetadata(requestMock, responseMock, nextMock);
    expect(matchedDataMock).toHaveBeenCalledWith(requestMock);
  });

  it('returns response configured with 400 status and error message if metadata does not contain one of fileLocation or masterUrl', async () => {
    const requestMock = { }; // missing fileLocation and masterUrl
    const returnValue = await createAssetMetadata(requestMock, responseMock, nextMock);
    expect(returnValue).toBe(responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(400);
    expect(responseMock.send).toHaveBeenCalledWith({ error: "One of 'fileLocation' or 'masterUrl' must be defined." });
  });

  it('returns response configured with 409 status and result of metadataExists check if metadata already exists', async () => {
    const metadataExistsResponse = { conflicts: ['Expected test conflict'] };
    centralAssetRepoRepository.metadataExists.mockResolvedValueOnce(metadataExistsResponse);
    const requestMock = getMinimalRequestMock();

    const returnValue = await createAssetMetadata(requestMock, responseMock, nextMock);

    expect(returnValue).toBe(responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(409);
    expect(responseMock.send).toHaveBeenCalledWith(metadataExistsResponse);
  });

  it('calls next with an error if there is an error checking if the metadata exists', async () => {
    centralAssetRepoRepository.metadataExists.mockRejectedValueOnce(new Error('Expected test error'));
    const requestMock = getMinimalRequestMock();
    await createAssetMetadata(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Error creating asset metadata - failed to check if document already exists: Expected test error'));
  });

  it('creates new metadata document and returns the newly created document with 201 status', async () => {
    const requestMock = getMinimalRequestMock();
    const newMetaDocument = { ...requestMock, assetId: 'test-asset-id' };
    centralAssetRepoRepository.createMetadata.mockResolvedValueOnce(newMetaDocument);

    const returnValue = await createAssetMetadata(requestMock, responseMock, nextMock);

    // For testing, the request mock doubles as the metadata object containing the metadata values
    expect(centralAssetRepoRepository.createMetadata).toHaveBeenCalledWith(requestMock);
    expect(returnValue).toBe(responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(201);
    expect(responseMock.send).toHaveBeenCalledWith(newMetaDocument);
  });

  it('calls next with an error if there is an error when creating the new metadata document', async () => {
    const requestMock = getMinimalRequestMock();
    centralAssetRepoRepository.createMetadata.mockRejectedValueOnce(new Error('Expected test error'));
    await createAssetMetadata(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Error creating asset metadata - failed to create new document: Expected test error'));
  });
});
