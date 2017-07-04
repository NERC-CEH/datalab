import { entries, values, isEqual } from 'lodash';
import { addToLocalStorage, removeFromLocalStorage, getFromLocalStorage } from './localStorageUtil';

const localStorageFields = {
  access_token: 'accessToken',
  expires_at: 'expiresAt',
  id_token: 'idToken',
};

const localStorageFieldsKeys = Object.keys(localStorageFields);
const sessionFieldKeys = values(localStorageFields);

export function setSession(newSessionEntries) {
  const newSessionNames = Object.keys(newSessionEntries);
  entries(localStorageFields)
    .filter(([localStorageName, sessionName]) => newSessionNames.includes(sessionName))
    .forEach(([localStorageName, sessionName]) => addToLocalStorage(localStorageName, newSessionEntries[sessionName]));
}

export function clearSession() {
  localStorageFieldsKeys
    .forEach(localStorageName => removeFromLocalStorage(localStorageName));
}

export function getSession() {
  const currentSession = localStorageFieldsKeys
    .map(localStorageName => [localStorageName, getFromLocalStorage(localStorageName)])
    .reduce((previous, [key, value]) => {
      if (value) {
        return Object.assign(previous, { [localStorageFields[key]]: value });
      }
      return previous;
    }, {});

  if (isEqual(sessionFieldKeys, Object.keys(currentSession))) {
    return currentSession;
  }

  return null;
}
