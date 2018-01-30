import axios from 'axios/index';
import logger from 'winston/lib/winston';
import axiosErrorHandler from '../util/errorHandlers';
import datalabRepository from '../dataaccess/datalabRepository';
import config from '../config';

export function generateCreateElement(props) {
  const {
    apiRoute,
    elementName,
    generateApiRequest,
    generateApiPayload,
    createOrUpdateRecord,
  } = props;

  const API_URL = `${config.get('infrastructureApi')}/${apiRoute}`;
  const ERROR_MESSAGE = `Unable to create ${elementName}`;

  function createElement(user, datalabName, element) {
    logger.info(`Requesting ${elementName} creation for ${element.type} called '${element.name}'`);
    return datalabRepository.getByName(user, datalabName)
      .then(storeAndCreateElement(user, element))
      .catch(axiosErrorHandler(ERROR_MESSAGE));
  }

  const storeAndCreateElement = (user, element) => (datalabInfo) => {
    const apiRequest = generateApiRequest(element, datalabInfo);

    logger.debug(`Create database record: ${JSON.stringify(apiRequest)}`);
    return createOrUpdateRecord(user, apiRequest)
      .then(sendCreationRequest(apiRequest, datalabInfo))
      .then(() => element);
  };

  const sendCreationRequest = (apiRequest, datalabInfo) => () => {
    const payload = generateApiPayload(apiRequest, datalabInfo);

    logger.debug(`Create request url: ${API_URL}`);
    logger.debug(`Create request payload: ${JSON.stringify(payload)}`);
    return axios.post(API_URL, payload)
      .then(response => logger.info(response.data));
  };

  return createElement;
}

export function generateDeleteElement(props) {
  const {
    apiRoute,
    elementName,
    generateApiPayload,
    deleteRecord,
  } = props;

  const API_URL = `${config.get('infrastructureApi')}/${apiRoute}`;
  const ERROR_MESSAGE = `Unable to delete ${elementName}`;

  function deleteElement(user, datalabName, element) {
    logger.info(`Requesting ${elementName} deletion for ${element.type} called '${element.name}'`);
    return datalabRepository.getByName(user, datalabName)
      .then(removeAndDeleteElement(user, element))
      .then(() => element)
      .catch(axiosErrorHandler(ERROR_MESSAGE));
  }

  const removeAndDeleteElement = (user, element) => datalabInfo =>
    sendDeletionRequest(user, element, datalabInfo)
      .then(deleteRecord(user, element));

  const sendDeletionRequest = (user, element, datalabInfo) => {
    const payload = generateApiPayload(element, datalabInfo);

    logger.debug(`Delete request url: ${API_URL}`);
    logger.debug(`Delete request payload: ${JSON.stringify(payload)}`);
    return axios.delete(API_URL, { data: payload })
      .then(response => logger.info(response.data));
  };

  return deleteElement;
}
