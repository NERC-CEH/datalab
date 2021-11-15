import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createJob } from './jobApi';

import config from '../config/config';

const mock = new MockAdapter(axios);

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = 'namespace';

const JOB_URL = `${API_BASE}/apis/batch/v1/namespaces/${NAMESPACE}/jobs`;
const JOB_NAME = 'test-job';

const getJobManifest = () => `
apiVersion: batch/v1
kind: Job
metadata:
  name: test-job
`;

const getJob = () => ({
  apiVersion: 'batch/v1',
  kind: 'Job',
  metadata: { name: JOB_NAME },
});

describe('Kubernetes Job API', () => {
  beforeEach(() => {
    mock.reset();
  });
  afterAll(() => {
    mock.restore();
  });

  describe('createJob', () => {
    it('sends a POST request to create a job', async () => {
      mock.onPost(JOB_URL, getJobManifest()).reply((requestConfig) => {
        expect(requestConfig.headers['Content-Type']).toBe('application/yaml');
        return [200, getJob()];
      });

      const response = await createJob(JOB_NAME, NAMESPACE, getJobManifest());
      expect(response.data).toEqual(getJob());
    });

    it('return an error if the job creation fails', async () => {
      mock.onPost(JOB_URL).reply(400, { message: 'error-message' });

      await expect(createJob(JOB_NAME, NAMESPACE, getJobManifest())).rejects.toThrowError(
        'Kubernetes API: Unable to create kubernetes job \'test-job\' - error-message',
      );
    });
  });
});
