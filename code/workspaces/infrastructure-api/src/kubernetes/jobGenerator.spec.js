import { createCurlJob } from './jobGenerator';

const getInputs = () => ({
  name: 'job',
  runCommand: 'echo "Hello, World!"',
});

describe('createCurlJob', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(1609459200);
  });

  it('creates a job to match the snapshot', async () => {
    const manifest = await createCurlJob(getInputs());

    expect(manifest).toMatchSnapshot();
  });

  it('creates a job to match the snapshot when a curl command is supplied', async () => {
    const inputs = {
      ...getInputs(),
      curlCommand: 'curl -X PUT localhost:8000/restart',
      userToken: 'Bearer token',
    };
    const manifest = await createCurlJob(inputs);

    expect(manifest).toMatchSnapshot();
  });

  it('creates a job to match the snapshot when a volume and path is supplied', async () => {
    const inputs = {
      ...getInputs(),
      volumeMount: 'volume',
      mountPath: '/mnt/data',
    };
    const manifest = await createCurlJob(inputs);

    expect(manifest).toMatchSnapshot();
  });
});
