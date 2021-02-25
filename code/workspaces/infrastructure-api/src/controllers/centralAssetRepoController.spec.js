import * as expressValidator from 'express-validator';
import centralAssetRepoRepository from '../dataaccess/centralAssetRepoRepository';
import centralAssetRepoController from './centralAssetRepoController';

jest.mock('../dataaccess/centralAssetRepoRepository');

const matchedDataMock = jest
  .spyOn(expressValidator, 'matchedData')
  .mockImplementation(request => request);

const responseMock = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
};
const nextMock = jest.fn();

const getMinimalMetadata = () => ({
  name: 'Test Metadata',
  version: '0.1.0',
  ownerUserIds: [],
  visible: 'PUBLIC',
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
    const requestMock = getMinimalMetadata();

    const returnValue = await createAssetMetadata(requestMock, responseMock, nextMock);

    expect(returnValue).toBe(responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(409);
    expect(responseMock.send).toHaveBeenCalledWith(metadataExistsResponse);
  });

  it('calls next with an error if there is an error checking if the metadata exists', async () => {
    centralAssetRepoRepository.metadataExists.mockRejectedValueOnce(new Error('Expected test error'));
    const requestMock = getMinimalMetadata();
    await createAssetMetadata(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Error creating asset metadata - failed to check if document already exists: Expected test error'));
  });

  it('creates new metadata document and returns the newly created document with 201 status', async () => {
    const requestMock = getMinimalMetadata();
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
    const requestMock = getMinimalMetadata();
    centralAssetRepoRepository.createMetadata.mockRejectedValueOnce(new Error('Expected test error'));
    await createAssetMetadata(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Error creating asset metadata - failed to create new document: Expected test error'));
  });
});

describe('listAssetMetadata', () => {
  const { listAssetMetadata } = centralAssetRepoController;
  const requestMock = jest.fn();

  it('calls to list metadata and returns response configured with 200 status and array of metadata', async () => {
    const availableMetadata = [{ ...getMinimalMetadata(), assetId: 'asset-id' }];
    centralAssetRepoRepository.listMetadata.mockResolvedValueOnce(availableMetadata);

    const returnValue = await listAssetMetadata(requestMock, responseMock, nextMock);

    expect(returnValue).toBe(responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseMock.send).toHaveBeenCalledWith(availableMetadata);
  });

  it('calls next with an error if there is an error when listing the metadata', async () => {
    centralAssetRepoRepository.listMetadata.mockRejectedValueOnce(new Error('Expected test error'));
    await listAssetMetadata(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Error listing asset metadata: Expected test error'));
  });
});

describe('assetMetadataAvailableToProject', () => {
  const { assetMetadataAvailableToProject } = centralAssetRepoController;
  const projectKey = 'test-project';

  it('calls to get metadata available to project and returns response configured with 200 status and available projects', async () => {
    const requestMock = { projectKey };
    const availableMetadata = [{ ...getMinimalMetadata(), assetId: 'asset-id' }];
    centralAssetRepoRepository.metadataAvailableToProject.mockResolvedValueOnce(availableMetadata);

    const returnValue = await assetMetadataAvailableToProject(requestMock, responseMock, nextMock);

    expect(returnValue).toBe(responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseMock.send).toHaveBeenCalledWith(availableMetadata);
    expect(centralAssetRepoRepository.metadataAvailableToProject).toHaveBeenCalledWith(projectKey);
  });

  it('calls next with error if there is an error when querying metadata', async () => {
    const requestMock = { projectKey };
    centralAssetRepoRepository.metadataAvailableToProject.mockRejectedValueOnce(new Error('Expected test error'));
    await assetMetadataAvailableToProject(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Error listing asset metadata by key: Expected test error'));
  });
});
