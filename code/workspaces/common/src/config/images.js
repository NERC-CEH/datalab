import { lowerCase } from 'lodash';
import data from './image_config.json';

export const NOTEBOOK_CATEGORY = 'ANALYSIS';
export const SITE_CATEGORY = 'PUBLISH';
export const CLUSTER_CATEGORY = 'COMPUTE';

export function imageConfig() {
  return data.types;
}

export function getImageInfoForType(type) {
  const config = imageConfig();
  const imageInfo = config[lowerCase(type)];

  if (!imageInfo) {
    throw new Error(`Unable to find config for image of type "${type}"`);
  }

  return imageInfo;
}

export function imageList() {
  return Object.keys(data.types);
}

function byCategoryList(categories) {
  return imageList()
    .filter(type => categories.includes(data.types[type].category));
}

export function stackAndClusterList() {
  return byCategoryList([NOTEBOOK_CATEGORY, SITE_CATEGORY, CLUSTER_CATEGORY]);
}

export function stackList() {
  return byCategoryList([NOTEBOOK_CATEGORY, SITE_CATEGORY]);
}

export function notebookList() {
  return byCategoryList([NOTEBOOK_CATEGORY]);
}

export function siteList() {
  return byCategoryList([SITE_CATEGORY]);
}

export function clusterList() {
  return byCategoryList([CLUSTER_CATEGORY]);
}

export function versionList(type) {
  const img = lowerCase(type);
  return data.types[img].versions.map(ver => ver.displayName);
}

export function imageCategory(type) {
  return data.types[type].category;
}

export function image(type, version) {
  const imageInfo = getImageInfoForType(type);
  const versionsWithDisplayName = imageInfo.versions.filter(ver => ver.displayName === version);
  return versionsWithDisplayName[0];
}

export function defaultImage(type) {
  const imageInfo = getImageInfoForType(type);
  const defaultImg = imageInfo.versions.filter(ver => ver.default);
  if (defaultImg.length === 1) {
    return defaultImg[0];
  }
  return imageInfo.versions[0];
}
