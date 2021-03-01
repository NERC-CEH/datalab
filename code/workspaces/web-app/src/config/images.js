import axios from 'axios';

const NOTEBOOK_CATEGORY = 'ANALYSIS';
const SITE_CATEGORY = 'PUBLISH';

// These are cached values.
// Initialise asynchronously before React starts.
// Get synchronously within React.
let cachedData;
let cachedNotebooks;
let cachedSites;
let cachedUserActions;

async function initialiseImages() {
  const { data } = await axios.get('/image_config.json');
  cachedData = data;
  cachedNotebooks = getInfoForItemsInCategory(NOTEBOOK_CATEGORY);
  cachedSites = getInfoForItemsInCategory(SITE_CATEGORY);
  cachedUserActions = getInfoForUserActions();
}

function getInfoForItemsInCategory(category) {
  return Object.entries(cachedData.types).reduce(
    (infoForType, [key, value]) => {
      if (value.category === category) {
        infoForType[key] = value; // eslint-disable-line no-param-reassign
      }
      return infoForType;
    },
    {},
  );
}

function getInfoForUserActions() {
  return Object.entries(cachedData.types).reduce(
    (infoForType, [key, value]) => {
      infoForType[key] = calculateUserActionsForType(key); // eslint-disable-line no-param-reassign
      return infoForType;
    },
    {},
  );
}

function calculateUserActionsForType(type) {
  const typeInfo = cachedData.types[type];

  const actionDefaults = getActionDefaults();
  let categoryDefaultActions = {};
  let actionOverrides = {};

  if (typeInfo) {
    categoryDefaultActions = cachedData.categories[typeInfo.category].userActions || {};
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

const getNotebookInfo = () => (cachedNotebooks);
const getSiteInfo = () => (cachedSites);
const getUserActionsForType = type => (cachedUserActions[type] || getActionDefaults());

export { initialiseImages, getNotebookInfo, getSiteInfo, getUserActionsForType };
