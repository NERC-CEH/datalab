import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressGenerator from '../kubernetes/ingressGenerator';
import ingressApi from '../kubernetes/ingressApi';
import { createDeployment, createService, createIngressRule } from './stackBuilders';
import nameGenerator from '../common/nameGenerators';

const createSiteStack = async (params) => {
  await createDeployment(params, deploymentGenerator.createSiteDeployment)();
  const service = await createService(params, deploymentGenerator.createSiteService)();
  await createIngressRule(params, ingressGenerator.createIngress)(service);
};

const deleteSiteStack = async (params) => {
  const { name, type, projectKey } = params;
  const k8sName = nameGenerator.deploymentName(name, type);

  await ingressApi.deleteIngress(k8sName, projectKey);
  await serviceApi.deleteService(k8sName, projectKey);
  await deploymentApi.deleteDeployment(k8sName, projectKey);
};

export default { createSiteStack, deleteSiteStack };
