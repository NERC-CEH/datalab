import { createKubectlJob } from './jobGenerator';

const getInputs = () => ({
  name: 'job',
  runCommand: 'echo "Hello, World!"',
});

describe('createKubectlJob', () => {
  it('creates a job to match the snapshot', async () => {
    const manifest = await createKubectlJob(getInputs());

    expect(manifest).toMatchSnapshot();
  });

  it('creates a job to match the snapshot when a kubectl command is supplied', async () => {
    const inputs = {
      ...getInputs(),
      kubectlCommand: 'kubectl get pods',
    };
    const manifest = await createKubectlJob(inputs);

    expect(manifest).toMatchSnapshot();
  });

  it('creates a job to match the snapshot when a volume and path is supplied', async () => {
    const inputs = {
      ...getInputs(),
      volumeMount: 'volume',
      mountPath: '/mnt/data',
    };
    const manifest = await createKubectlJob(inputs);

    expect(manifest).toMatchSnapshot();
  });
});
