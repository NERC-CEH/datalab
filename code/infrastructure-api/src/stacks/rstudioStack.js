import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import proxyRouteApi from '../kong/proxyRouteApi';
import { createDeployment, createService, createProxyRoute } from './stackBuilders';

function createRStudioStack(datalabInfo, name, type) {
  return createDeployment(datalabInfo, name, type, deploymentGenerator.createRStudioDeployment)()
    .then(createService(name, type, deploymentGenerator.createRStudioService))
    .then(createProxyRoute(name, datalabInfo));
}

function deleteRStudioStack(datalabInfo, name, type) {
  const k8sName = `${type}-${name}`;
  return proxyRouteApi.deleteRoute(name, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName));
}

export default { createRStudioStack, deleteRStudioStack };
