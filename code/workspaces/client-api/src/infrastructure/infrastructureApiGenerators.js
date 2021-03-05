import axios from 'axios/index';
import logger from 'winston';
import { axiosErrorHandler } from '../util/errorHandlers';
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

  function createElement({ user, token }, datalabName, element) {
    logger.info(`Requesting ${elementName} creation for ${element.type} called '${element.name}'`);
    return datalabRepository.getByName(user, datalabName)
      .then(storeAndCreateElement({ user, token }, element))
      .catch(axiosErrorHandler(ERROR_MESSAGE));
  }

  const storeAndCreateElement = ({ user, token }, element) => (datalabInfo) => {
    const apiRequest = generateApiRequest(element, datalabInfo);

    logger.debug(`Create database record: ${JSON.stringify(apiRequest)}`);
    return createOrUpdateRecord(user, apiRequest)
      .then(sendCreationRequest(token, apiRequest, datalabInfo))
      .then(() => element);
  };

  const sendCreationRequest = (token, apiRequest, datalabInfo) => () => {
    const payload = generateApiPayload(apiRequest, datalabInfo);

    logger.debug(`Create request url: ${API_URL}`);
    logger.debug(`Create request payload: ${JSON.stringify(payload)}`);
    return axios.post(API_URL, payload, { headers: { authorization: token } })
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

  function deleteElement({ user, token }, datalabName, element) {
    logger.info(`Requesting ${elementName} deletion for ${element.type} called '${element.name}'`);
    return datalabRepository.getByName(user, datalabName)
      .then(removeAndDeleteElement({ user, token }, element))
      .then(() => element)
      .catch(axiosErrorHandler(ERROR_MESSAGE));
  }

  const removeAndDeleteElement = ({ user, token }, element) => datalabInfo => sendDeletionRequest(token, element, datalabInfo)
    .then(deleteRecord(user, element));

  const sendDeletionRequest = (token, element, datalabInfo) => {
    const payload = generateApiPayload(element, datalabInfo);

    logger.debug(`Delete request url: ${API_URL}`);
    logger.debug(`Delete request payload: ${JSON.stringify(payload)}`);
    return axios.delete(API_URL, { data: payload, headers: { authorization: token } })
      .then(response => logger.info(response.data));
  };

  return deleteElement;
}
