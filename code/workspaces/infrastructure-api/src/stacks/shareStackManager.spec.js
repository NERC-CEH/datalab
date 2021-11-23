import { stackTypes } from 'common';
import { NOTEBOOK_CATEGORY, SITE_CATEGORY } from 'common/src/config/images';
import { getCurlCommand, handleSharedChange } from './shareStackManager';
import config from '../config/config';
import secretManager from '../credentials/secretManager';
import jobApi from '../kubernetes/jobApi';
import ingressApi from '../kubernetes/ingressApi';
import deploymentApi from '../kubernetes/deploymentApi';
import zeppelin from './zeppelinStack';

jest.mock('../credentials/secretManager');
jest.mock('../kubernetes/jobApi');
jest.mock('../kubernetes/ingressApi');
jest.mock('../kubernetes/deploymentApi');
jest.mock('./zeppelinStack');

const projectKey = 'project';
const name = 'stackname';

const volumeMount = 'volume';

const { JUPYTERLAB, ZEPPELIN, RSTUDIO, RSHINY } = stackTypes;

const getParams = () => ({
  projectKey,
  name,
});
const getExisting = () => ({
  shared: 'project',
  visible: 'project',
  volumeMount,
});
const userToken = 'Bearer token';

// Function to help 'expect' numbers of calls for certain functions (so we don't need to replicate this several times).
const expectCalls = ({
  createJob = 0,
  patchIngress = 0,
  createStackCredentialSecret = 0,
  getDeployment = 0,
  restartDeployment = 0,
  generateNewShiroIni = 0,
}) => {
  expect(jobApi.createJob).toHaveBeenCalledTimes(createJob);
  expect(ingressApi.patchIngress).toHaveBeenCalledTimes(patchIngress);
  expect(secretManager.createStackCredentialSecret).toHaveBeenCalledTimes(createStackCredentialSecret);
  expect(deploymentApi.getDeployment).toHaveBeenCalledTimes(getDeployment);
  expect(deploymentApi.restartDeployment).toHaveBeenCalledTimes(restartDeployment);
  expect(zeppelin.generateNewShiroIni).toHaveBeenCalledTimes(generateNewShiroIni);
};

describe('handleSharedChange', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does nothing if the old status is private', async () => {
    const existing = {
      ...getExisting(),
      shared: 'private',
    };
    await handleSharedChange(getParams(), existing, 'project', userToken);

    expectCalls({});
  });

  it('does nothing if the new status is the same as the old status', async () => {
    await handleSharedChange(getParams(), getExisting(), 'project');

    expectCalls({});
  });

  it('does nothing if nothing is to be done for the site category', async () => {
    const existing = {
      ...getExisting(),
      category: 'other',
    };
    await handleSharedChange(getParams(), existing, 'public', userToken);

    expectCalls({});
  });

  it('does nothing for RStudio notebooks', async () => {
    const existing = {
      ...getExisting(),
      category: NOTEBOOK_CATEGORY,
      type: RSTUDIO,
    };
    await handleSharedChange(getParams(), existing, 'private', userToken);

    expectCalls({});
  });

  it('does nothing for Sites that are not changing to or from public', async () => {
    const existing = {
      ...getExisting(),
      category: SITE_CATEGORY,
      type: RSHINY,
    };
    await handleSharedChange(getParams(), existing, 'private', userToken);

    expectCalls({});
  });

  it('handles Sites changing to public', async () => {
    const existing = {
      ...getExisting(),
      category: SITE_CATEGORY,
      type: RSHINY,
    };
    const expectedPatch = {
      metadata: {
        annotations: {
          'nginx.ingress.kubernetes.io/auth-url': null,
        },
      },
    };

    await handleSharedChange(getParams(), existing, 'public', userToken);

    expectCalls({ patchIngress: 1 });
    expect(ingressApi.patchIngress).toHaveBeenCalledWith('rshiny-stackname', projectKey, expectedPatch);
  });

  it('handles Sites changing from public', async () => {
    const existing = {
      ...getExisting(),
      category: SITE_CATEGORY,
      type: RSHINY,
      shared: 'public',
      visible: 'public',
    };
    jest.spyOn(config, 'get').mockReturnValue('configUrl');

    const expectedPatch = {
      metadata: {
        annotations: {
          'nginx.ingress.kubernetes.io/auth-url': 'configUrl/auth',
        },
      },
    };

    await handleSharedChange(getParams(), existing, 'project', userToken);

    expectCalls({ patchIngress: 1 });
    expect(ingressApi.patchIngress).toHaveBeenCalledWith('rshiny-stackname', projectKey, expectedPatch);
  });

  it('handles Jupyter notebooks changing to private', async () => {
    const existing = {
      ...getExisting(),
      category: NOTEBOOK_CATEGORY,
      type: JUPYTERLAB,
    };
    jest.spyOn(Date, 'now').mockReturnValue(1609459200);

    secretManager.createNewJupyterCredentials = jest.fn(() => ({ token: 'token' }));
    deploymentApi.getDeployment.mockResolvedValueOnce({
      spec: {
        template: {
          spec: {
            containers: [
              {
                name: 'jupyterlab-stackname',
                env: [
                  {
                    name: 'JUPYTER_DATA_DIR',
                    value: '/data/notebooks/jupyterlab-stackname/.jupyter',
                  },
                ],
              },
            ],
          },
        },
      },
    });

    await handleSharedChange(getParams(), existing, 'private', userToken);

    expectCalls({ createJob: 1, createStackCredentialSecret: 1, getDeployment: 1 });
    expect(secretManager.createStackCredentialSecret).toHaveBeenCalledWith(name, JUPYTERLAB, projectKey, { token: 'token' });
    expect(deploymentApi.getDeployment).toHaveBeenCalledWith('jupyterlab-stackname', projectKey);
    expect(jobApi.createJob).toHaveBeenCalledWith(name, projectKey, expect.any(String));
    expect(jobApi.createJob.mock.calls[0][2]).toMatchSnapshot();
  });

  it('handles Zeppelin notebooks changing to private', async () => {
    const existing = {
      ...getExisting(),
      category: NOTEBOOK_CATEGORY,
      type: ZEPPELIN,
    };

    const expectedCredentials = {
      username: 'datalab',
      password: 'password',
    };
    secretManager.createNewUserCredentials = jest.fn(() => expectedCredentials);
    zeppelin.generateNewShiroIni.mockResolvedValueOnce({ 'shiro.ini': 'shiro' });

    const expectedFullCredentials = {
      'shiro.ini': 'shiro',
      ...expectedCredentials,
    };

    await handleSharedChange(getParams(), existing, 'private', userToken);

    expectCalls({ createStackCredentialSecret: 1, restartDeployment: 1, generateNewShiroIni: 1 });
    expect(zeppelin.generateNewShiroIni).toHaveBeenCalledWith(expectedCredentials);
    expect(secretManager.createStackCredentialSecret).toHaveBeenCalledWith(name, ZEPPELIN, projectKey, expectedFullCredentials);
    expect(deploymentApi.restartDeployment).toHaveBeenCalledWith('zeppelin-stackname', projectKey);
  });
});

describe('getCurlCommand', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('formats the request correctly', () => {
    const mockConfig = {
      apiPort: 8000,
      deployedNamespace: 'test',
      deployedInCluster: true,
    };
    jest.spyOn(config, 'get').mockReturnValueOnce(mockConfig);

    // eslint-disable-next-line max-len
    const expected = 'curl -X PUT infrastructure-api-service.test.svc.cluster.local:8000/stack/project/restart -H "Authorization: $TOKEN" -H "Content-Type: application/json" -d \'\'{"projectKey":"project","name":"stackname","type":"jupyterlab"}\'\'';

    expect(getCurlCommand('project', 'stackname', 'jupyterlab')).toEqual(expected);
  });

  it('formats the request correctly for running locally', () => {
    const mockConfig = {
      apiPort: 8000,
      deployedNamespace: 'test',
      deployedInCluster: false,
    };
    jest.spyOn(config, 'get').mockReturnValueOnce(mockConfig);

    // eslint-disable-next-line max-len
    const expected = 'curl -X PUT host.docker.internal:8000/stack/project/restart -H "Authorization: $TOKEN" -H "Content-Type: application/json" -d \'\'{"projectKey":"project","name":"stackname","type":"jupyterlab"}\'\'';

    expect(getCurlCommand('project', 'stackname', 'jupyterlab')).toEqual(expected);
  });
});

