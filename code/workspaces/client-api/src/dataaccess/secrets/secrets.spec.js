import axios from 'axios';
import config from '../../config';
import secrets from './secrets';

jest.mock('axios');
jest.mock('../../config');

const infrastructureApi = 'infrastructure-api.datalabs';
config.get.mockImplementation(key => (key === 'infrastructureApi' ? infrastructureApi : undefined));

const stack = {
  type: 'stack-type',
  name: 'stack-name',
};
const projectKey = 'testproject';
const userToken = 'Bearer usertoken';
const returnData = { data: 'return-data' };

axios.get.mockReturnValue(returnData);

describe('getStackSecret', () => {
  describe('constructs and sends correct request', () => {
    it('when key not provided', () => {
      secrets.getStackSecret(stack, projectKey, userToken);
      expect(axios.get).toHaveBeenCalledWith(
        `${infrastructureApi}/secrets/stack`,
        {
          params: { projectKey, stackName: stack.name, stackType: stack.type },
          headers: { authorization: userToken },
        },
      );
    });

    it('when key provided', () => {
      const key = 'secretKey';
      secrets.getStackSecret(stack, projectKey, userToken, key);
      expect(axios.get).toHaveBeenCalledWith(
        `${infrastructureApi}/secrets/stack`,
        {
          params: { projectKey, stackName: stack.name, stackType: stack.type, key },
          headers: { authorization: userToken },
        },
      );
    });
  });
});
