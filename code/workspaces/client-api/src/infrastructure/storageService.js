import axios from 'axios/index';
import config from '../config';
import generateOptions from '../auth/tokens';

const API_URL_BASE = config.get('infrastructureApi');

async function createVolume(storageRequest, token) {
  const url = `${API_URL_BASE}/volume`;
  const options = generateOptions(token);
  const data = storageRequest;

  const response = await axios.post(url, data, options);
  return response.data;
}

async function deleteVolume(storageRequest, token) {
  const method = 'delete';
  const url = `${API_URL_BASE}/volume`;
  const options = generateOptions(token);
  const requestConfig = { method, url, ...options, data: storageRequest };

  // Given this request requires a body the axios.delete method cannot be used
  const response = await axios.request(requestConfig);
  return response.data;
}

async function getAllActive(token) {
  const response = await axios.get(`${API_URL_BASE}/volumes/active`, generateOptions(token));
  return response.data;
}

async function getById(id, token) {
  const response = await axios.get(`${API_URL_BASE}/volumes/${id}`, generateOptions(token));
  return response.data;
}

async function addUsers(name, users, token) {
  const url = `${API_URL_BASE}/volumes/${name}/addUsers`;
  const response = await axios.put(url, { userIds: users }, generateOptions(token));
  return response.data;
}

async function removeUsers(name, users, token) {
  const url = `${API_URL_BASE}/volumes/${name}/removeUsers`;
  const response = await axios.put(url, { userIds: users }, generateOptions(token));
  return response.data;
}

export default { getAllActive, getById, addUsers, removeUsers, createVolume, deleteVolume };
