import axios from 'axios';
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

async function getAllProjectActive(projectKey, token) {
  const response = await axios.get(`${API_URL_BASE}/volumes/active/${projectKey}`, generateOptions(token));
  return response.data;
}

async function getById(projectKey, id, token) {
  const response = await axios.get(`${API_URL_BASE}/volumes/${projectKey}/${id}`, generateOptions(token));
  return response.data;
}

async function addUsers(projectKey, name, users, token) {
  const url = `${API_URL_BASE}/volumes/${projectKey}/${name}/addUsers`;
  const response = await axios.put(url, { userIds: users }, generateOptions(token));
  return response.data;
}

async function removeUsers(projectKey, name, users, token) {
  const url = `${API_URL_BASE}/volumes/${projectKey}/${name}/removeUsers`;
  const response = await axios.put(url, { userIds: users }, generateOptions(token));
  return response.data;
}

async function updateDetails(projectKey, name, updatedDetails, token) {
  const url = `${API_URL_BASE}/volumes/${projectKey}/${name}`;
  const response = await axios.patch(url, updatedDetails, generateOptions(token));
  return response.data;
}

export default {
  getAllProjectActive, getById, addUsers, removeUsers, createVolume, deleteVolume, updateDetails,
};
