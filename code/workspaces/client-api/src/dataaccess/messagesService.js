import axios from 'axios';
import config from '../config';
import { wrapWithAxiosErrorWrapper } from '../util/errorHandlers';
import requestConfig from '../util/requestConfig';

const infrastructureApi = () => axios.create({
  baseURL: `${config.get('infrastructureApi')}/messages`,
});

async function createMessage(message, token) {
  const { data } = await infrastructureApi().post(
    '/',
    message,
    requestConfig(token),
  );
  return data;
}

async function deleteMessage(messageId, token) {
  const { data } = await infrastructureApi().delete(
    `/${messageId}`,
    requestConfig(token),
  );
  return data;
}

async function getMessages(token) {
  const { data } = await infrastructureApi().get(
    '/',
    requestConfig(token),
  );
  return data;
}

async function getAllMessages(token) {
  const { data } = await infrastructureApi().get(
    '/all',
    requestConfig(token),
  );
  return data;
}

export default {
  createMessage: wrapWithAxiosErrorWrapper('Error creating message.', createMessage),
  deleteMessage: wrapWithAxiosErrorWrapper('Error deleting message.', deleteMessage),
  getMessages: wrapWithAxiosErrorWrapper('Error getting active messages.', getMessages),
  getAllMessages: wrapWithAxiosErrorWrapper('Error getting all messages.', getAllMessages),
};
