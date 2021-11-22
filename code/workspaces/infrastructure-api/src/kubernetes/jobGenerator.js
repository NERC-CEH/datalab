import { JobTemplates, generateManifest } from './manifestGenerator';
import nameGenerators from '../common/nameGenerators';

const { jobName } = nameGenerators;

export const createCurlJob = ({ name, runCommand, curlCommand, volumeMount, mountPath, userToken }) => {
  const job = jobName(name);

  const context = {
    name: job,
    runCommand,
    curlCommand,
    volumeMount,
    mountPath,
    userToken,
  };

  return generateManifest(context, JobTemplates.DEFAULT_JOB);
};

export default {
  createCurlJob,
};
