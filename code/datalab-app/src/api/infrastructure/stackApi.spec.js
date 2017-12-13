import {
  createStackRequest,
  createStackPayload,
  deleteStackPayload,
} from './stackApi';

jest.mock('../dataaccess/dataStorageRepository');

const datalabInfo = { name: 'testlab', domain: 'test-datalabs.nerc.ac.uk' };

describe('Stack API configuration', () => {
  it('should give correct API request for creation', () => {
    const stack = { name: 'notebookName', type: 'jupyter' };

    expect(createStackRequest(stack, datalabInfo)).toMatchSnapshot();
  });

  it('should give correct API payload for creation', () => {
    const datalabRequest = {
      name: 'notebookName',
      type: 'jupyter',
      url: 'https://testlab-notebookName.test-datalabs.nerc.ac.uk',
      internalEndpoint: 'http://jupyter-notebookName',
      sourcePath: 'expectedSourcePath',
    };

    expect(createStackPayload(datalabRequest, datalabInfo)).toMatchSnapshot();
  });

  it('should give correct API payload for deletion', () => {
    const stack = { name: 'dataStoreName', type: 'jupyter', extra: 'field' };

    expect(deleteStackPayload(stack, datalabInfo)).toMatchSnapshot();
  });
});
