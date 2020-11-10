import axios from 'axios';

const NOTEBOOK_CATEGORY = 'NOTEBOOK';
const SITE_CATEGORY = 'SITE';

let cachedData;
let cachedNotebooks;
let cachedSites;
const cachedUserActions = {};

export async function imageConfig() {
  return asyncCachedReturn(
    cachedData,
    async () => {
      const { data } = await axios.get('/image_config.json');
      return data;
    },
  );
}

async function getInfoForItemsInCategory(category) {
  const data = await imageConfig();
  return Object.entries(data.types).reduce(
    (infoForType, [key, value]) => {
      if (value.category === category) {
        infoForType[key] = value; // eslint-disable-line no-param-reassign
      }
      return infoForType;
    },
    {},
  );
}

export async function getNotebookInfo() {
  return asyncCachedReturn(cachedNotebooks, getInfoForItemsInCategory, NOTEBOOK_CATEGORY);
}

export async function getSiteInfo() {
  return asyncCachedReturn(cachedSites, getInfoForItemsInCategory, SITE_CATEGORY);
}

export async function getUserActionsForType(type) {
  if (!cachedUserActions[type]) {
    cachedUserActions[type] = await calculateUserActionsForType(type);
  }
  return cachedUserActions[type];
}

async function calculateUserActionsForType(type) {
  const data = await imageConfig();
  const typeInfo = data.types[type];

  const actionDefaults = getActionDefaults();
  let categoryDefaultActions = {};
  let actionOverrides = {};

  if (typeInfo) {
    categoryDefaultActions = data.categories[typeInfo.category].userActions || {};
    actionOverrides = typeInfo.userActionOverrides || {};
  }

  return { ...actionDefaults, ...categoryDefaultActions, ...actionOverrides };
}

function getActionDefaults() {
  const possibleActions = ['share', 'edit', 'restart', 'delete', 'logs'];
  const defaultValue = true;
  return possibleActions.reduce(
    (returnValue, actionName) => {
      returnValue[actionName] = defaultValue; // eslint-disable-line no-param-reassign
      return returnValue;
    }, {},
  );
}

async function asyncCachedReturn(cachedValueStoreVariable, fn, ...fnArgs) {
  if (!cachedValueStoreVariable) {
    cachedValueStoreVariable = await fn(...fnArgs); // eslint-disable-line no-param-reassign
  }
  return cachedValueStoreVariable;
}
