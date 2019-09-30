export default function getUrlNameStartEndText(projectKey, windowLocation) {
  const separator = '.';
  const restHostname = windowLocation.hostname.split(separator).slice(1);
  const startText = `${windowLocation.protocol}//${projectKey}-`;

  let endText = `${separator}${restHostname.join(separator)}`;

  if (windowLocation.hostname === 'localhost') {
    endText = '.datalabs.localhost';
  }

  return { startText, endText };
}
