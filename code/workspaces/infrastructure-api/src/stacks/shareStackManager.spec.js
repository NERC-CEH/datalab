import { stackTypes } from 'common';
import { NOTEBOOK_CATEGORY, SITE_CATEGORY } from 'common/src/config/images';
import { handleSharedChange } from './shareStackManager';
import config from '../config/config';
import secretManager from '../credentials/secretManager';
import jobApi from '../kubernetes/jobApi';
import ingressApi from '../kubernetes/ingressApi';
import deploymentApi from '../kubernetes/deploymentApi';
import zeppelin from './zeppelinStack';

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

// Function to help 'expect' numbers of calls for certain functions (so we don't need to replicate this several times).
const expectCalls = ({
  createJob = 0,
  patchIngress = 0,
  createStackCredentialSecret = 0,
  restartDeployment = 0,
  generateNewShiroIni = 0,
}) => {
  expect(jobApi.createJob).toHaveBeenCalledTimes(createJob);
  expect(ingressApi.patchIngress).toHaveBeenCalledTimes(patchIngress);
  expect(secretManager.createStackCredentialSecret).toHaveBeenCalledTimes(createStackCredentialSecret);
  expect(deploymentApi.restartDeployment).toHaveBeenCalledTimes(restartDeployment);
  expect(zeppelin.generateNewShiroIni).toHaveBeenCalledTimes(generateNewShiroIni);
};

describe('handleSharedChange', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mock('../credentials/secretManager');
    jest.mock('../kubernetes/jobApi');
    jest.mock('../kubernetes/ingressApi');
    jest.mock('../kubernetes/deploymentApi');
    jest.mock('./zeppelinStack');

    secretManager.createStackCredentialSecret = jest.fn();
    jobApi.createJob = jest.fn();
    ingressApi.patchIngress = jest.fn();
    deploymentApi.restartDeployment = jest.fn();
    zeppelin.generateNewShiroIni = jest.fn();
  });

  it('does nothing if the old status is private', async () => {
    const existing = {
      ...getExisting(),
      shared: 'private',
    };
    await handleSharedChange(getParams(), existing, 'project');

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
    await handleSharedChange(getParams(), existing, 'public');

    expectCalls({});
  });

  it('does nothing for RStudio notebooks', async () => {
    const existing = {
      ...getExisting(),
      category: NOTEBOOK_CATEGORY,
      type: RSTUDIO,
    };
    await handleSharedChange(getParams(), existing, 'private');

    expectCalls({});
  });

  it('does nothing for Sites that are not changing to or from public', async () => {
    const existing = {
      ...getExisting(),
      category: SITE_CATEGORY,
      type: RSHINY,
    };
    await handleSharedChange(getParams(), existing, 'private');

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

    await handleSharedChange(getParams(), existing, 'public');

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

    await handleSharedChange(getParams(), existing, 'project');

    expectCalls({ patchIngress: 1 });
    expect(ingressApi.patchIngress).toHaveBeenCalledWith('rshiny-stackname', projectKey, expectedPatch);
  });

  it('handles Jupyter notebooks changing to private', async () => {
    const existing = {
      ...getExisting(),
      category: NOTEBOOK_CATEGORY,
      type: JUPYTERLAB,
    };

    const expectedCredentials = expect.objectContaining({
      token: expect.any(String),
    });

    await handleSharedChange(getParams(), existing, 'private');

    expectCalls({ createJob: 1, createStackCredentialSecret: 1 });
    expect(secretManager.createStackCredentialSecret).toHaveBeenCalledWith(name, JUPYTERLAB, projectKey, expectedCredentials);
    expect(jobApi.createJob).toHaveBeenCalledWith(name, projectKey, expect.any(String));
    expect(jobApi.createJob.mock.calls[0][2]).toMatchSnapshot();
  });

  it('handles Zeppelin notebooks changing to private', async () => {
    const existing = {
      ...getExisting(),
      category: NOTEBOOK_CATEGORY,
      type: ZEPPELIN,
    };

    zeppelin.generateNewShiroIni.mockResolvedValueOnce({ 'shiro.ini': 'shiro' });

    const expectedCredentials = expect.objectContaining({
      username: 'datalab',
      password: expect.any(String),
    });
    const expectedFullCredentials = expect.objectContaining({
      'shiro.ini': 'shiro',
      username: 'datalab',
      password: expect.any(String),
    });

    await handleSharedChange(getParams(), existing, 'private');

    expectCalls({ createStackCredentialSecret: 1, restartDeployment: 1, generateNewShiroIni: 1 });
    expect(zeppelin.generateNewShiroIni).toHaveBeenCalledWith(expectedCredentials);
    expect(secretManager.createStackCredentialSecret).toHaveBeenCalledWith(name, ZEPPELIN, projectKey, expectedFullCredentials);
    expect(deploymentApi.restartDeployment).toHaveBeenCalledWith('zeppelin-stackname', projectKey);
  });
});

