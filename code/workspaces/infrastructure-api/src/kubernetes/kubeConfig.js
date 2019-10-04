import * as k8s from '@kubernetes/client-node';
import config from '../config/config';

const kubeApi = config.get('kubernetesApi');
const kubeNamespace = config.get('podNamespace');

// Using loadFromOptions method rather than loadFromDefault as loadFromDefault does not
// work inside a docker container in the development environment.
// loadFromDefault looks for: a kubeConfig file it can load; or a service account token;
// or looks at http://localhost:8080
// (https://github.com/kubernetes-client/javascript/blob/master/src/config.ts).
// Would therefore need to find a way to inject a config file into the container that
// could see a kubernetes cluster on same machine as container is running on or provide
// some form of service account token (the last method will never work in a container
// as it will be looking for a kubernetes cluster inside itself).
// With loadFromOptions, kubeApi variable can be set to localhost:8001 when running in
// kubernetes or use docker's system for connecting to local machine i.e.
// docker.for.mac.localhost:8001.
const cluster = {
  name: 'default-cluster',
  server: kubeApi,
};
const user = {
  name: 'default-auth',
};
const context = {
  name: 'default-context',
  user: user.name,
  cluster: cluster.name,
  namespace: kubeNamespace,
};

const kubeConfig = new k8s.KubeConfig();
kubeConfig.loadFromOptions({
  clusters: [cluster],
  users: [user],
  contexts: [context],
  currentContext: context.name,
});

const coreV1Api = kubeConfig.makeApiClient(k8s.CoreV1Api);
const getCoreV1Api = () => coreV1Api;

export default kubeConfig;
export { getCoreV1Api };
