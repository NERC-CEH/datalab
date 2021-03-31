import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressGenerator from '../kubernetes/ingressGenerator';
import ingressApi from '../kubernetes/ingressApi';
import { createDeployment, createService, createIngressRule } from './stackBuilders';
import nameGenerator from '../common/nameGenerators';

function createNbViewerStack(params) {
  return createDeployment(params, deploymentGenerator.createNbViewerDeployment)()
    .then(createService(params, deploymentGenerator.createNbViewerService))
    .then(createIngressRule(params, ingressGenerator.createIngress));
}

function deleteNbViewerStack(params) {
  const { projectKey, name, type } = params;
  const k8sName = nameGenerator.deploymentName(name, type);

  return ingressApi.deleteIngress(k8sName, projectKey)
    .then(() => serviceApi.deleteService(k8sName, projectKey))
    .then(() => deploymentApi.deleteDeployment(k8sName, projectKey));
}

export default { createNbViewerStack, deleteNbViewerStack };
