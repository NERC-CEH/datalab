import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressGenerator from '../kubernetes/ingressGenerator';
import ingressApi from '../kubernetes/ingressApi';
import { createDeployment, createService, createIngressRule } from './stackBuilders';

function createNbViewerStack(params) {
  const { datalabInfo, name, type } = params;

  return createDeployment(params, deploymentGenerator.createNbViewerDeployment)()
    .then(createService(name, type, deploymentGenerator.createNbViewerService))
    .then(createIngressRule(name, type, datalabInfo, ingressGenerator.createIngress));
}

function deleteNbViewerStack(params) {
  const { datalabInfo, name, type } = params;
  const k8sName = `${type}-${name}`;

  return ingressApi.deleteIngress(k8sName, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName));
}

export default { createNbViewerStack, deleteNbViewerStack };
