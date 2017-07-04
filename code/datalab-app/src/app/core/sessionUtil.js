import { entries } from 'lodash';
import { addToLocalStorage, removeFromLocalStorage } from './localStorageUtil';

const localStorageFields = {
  access_token: 'accessToken',
  expires_at: 'expiresAt',
  id_token: 'idToken',
};

export function setSession(newSessionEntries) {
  const newSessionNames = Object.keys(newSessionEntries);
  entries(localStorageFields)
    .filter(([localStorageName, sessionName]) => newSessionNames.includes(sessionName))
    .forEach(([localStorageName, sessionName]) => addToLocalStorage(localStorageName, newSessionEntries[sessionName]));
}

export function clearSession() {
  Object.keys(localStorageFields)
    .forEach(localStorageName => removeFromLocalStorage(localStorageName));
}
