import { JobTemplates, generateManifest } from './manifestGenerator';
import nameGenerators from '../common/nameGenerators';

const { jobName } = nameGenerators;

export const createKubectlJob = ({ name, runCommand, kubectlCommand, volumeMount, mountPath }) => {
  const job = jobName(name);

  const context = {
    name: job,
    runCommand,
    kubectlCommand,
    volumeMount,
    mountPath,
  };

  return generateManifest(context, JobTemplates.DEFAULT_JOB);
};

export default {
  createKubectlJob,
};
