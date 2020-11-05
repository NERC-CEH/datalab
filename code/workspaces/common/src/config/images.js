import { upperCase } from 'lodash';
import data from './image_config.json';

export function imageConfig() {
  return data.images;
}

export function imageList() {
  return Object.keys(data.images);
}

export function versionList(type) {
  const img = upperCase(type);
  return data.images[img].versions.map(ver => ver.displayName);
}
export function image(type, version) {
  const img = upperCase(type);
  const imgName = data.images[img].versions.filter(ver => ver.displayName === version);
  return imgName[0];
}

export function defaultImage(type) {
  const img = upperCase(type);
  const defaultImg = data.images[img].versions.filter(ver => ver.default);
  if (defaultImg.length === 1) {
    return defaultImg[0];
  }
  return data.images[img].versions[0];
}
