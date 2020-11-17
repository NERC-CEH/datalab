import { lowerCase } from 'lodash';
import data from './image_config.json';

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

export function versionList(type) {
  const img = lowerCase(type);
  return data.types[img].versions.map(ver => ver.displayName);
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
