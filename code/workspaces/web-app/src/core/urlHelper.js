import { stackTypes } from 'common';
import { join } from 'path';

const { isSingleHostName, basePath } = stackTypes;

export default function getUrlNameStartEndText(projectKey, windowLocation, type) {
  return isSingleHostName(type) ? singleHostName(projectKey, windowLocation, type) : multiHostName(projectKey, windowLocation);
}

function singleHostName(projectKey, windowLocation, type) {
  const hostAndPath = join(windowLocation.hostname, basePath(type, projectKey, ''));
  const startText = `${windowLocation.protocol}//${hostAndPath}`;
  const endText = '';
  return { startText, endText };
}

function multiHostName(projectKey, windowLocation) {
  const separator = '.';
  const restHostname = windowLocation.hostname.split(separator).slice(1);
  const startText = `${windowLocation.protocol}//${projectKey}-`;

  let endText = `${separator}${restHostname.join(separator)}`;

  if (windowLocation.hostname === 'localhost') {
    endText = '.datalabs.localhost';
  }

  return { startText, endText };
}
