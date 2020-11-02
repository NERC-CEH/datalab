import axios from 'axios';

const NOTEBOOK_TYPE = 'notebook';
const SITE_TYPE = 'site';

let cachedData;
let cachedNotebooks;
let cachedSites;

export async function imageConfig() {
  if (cachedData) {
    return cachedData;
  }

  const { data } = await axios.get('/image_config.json');
  cachedData = data;
  return cachedData;
}

async function getInfoForType(type) {
  const data = await imageConfig();
  return Object.entries(data.images).reduce(
    (currentValue, [key, value]) => {
      if (value.type === type) {
        return { ...currentValue, [key]: value };
      }
      return currentValue;
    },
    {},
  );
}

export async function getNotebookInfo() {
  if (!cachedNotebooks) {
    cachedNotebooks = await getInfoForType(NOTEBOOK_TYPE);
  }
  return cachedNotebooks;
}

export async function getSiteInfo() {
  if (!cachedSites) {
    cachedSites = await getInfoForType(SITE_TYPE);
  }
  return cachedSites;
}
