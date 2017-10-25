import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import proxyRouteApi from '../kong/proxyRouteApi';
import { createDeployment, createService, createProxyRoute } from './stackBuilders';

function createNbViewerStack(params) {
  const { datalabInfo, name, type } = params;

  return createDeployment(params, deploymentGenerator.createNbViewerDeployment)()
    .then(createService(name, type, deploymentGenerator.createNbViewerService))
    .then(createProxyRoute(name, datalabInfo));
}

function deleteNbViewerStack(params) {
  const { datalabInfo, name, type } = params;
  const k8sName = `${type}-${name}`;

  return proxyRouteApi.deleteRoute(name, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName));
}

export default { createNbViewerStack, deleteNbViewerStack };
