const kubeNameDelim = '-';

export const parseKubeName = (kubeName) => {
  const [head, ...tail] = String(kubeName).split(kubeNameDelim);

  return [head, tail.join(kubeNameDelim)];
};

export const getPodName = kubeName =>
  parseKubeName(kubeName)[1];

export const getPodType = kubeName =>
  parseKubeName(kubeName)[0];

export const parsePodLabels = (labels, selectorLabel) => {
  const kubeName = labels.name;
  let name;
  let type;

  if (selectorLabel) {
    name = getPodName(kubeName);
    type = labels[selectorLabel];
  } else {
    [type, name] = parseKubeName(kubeName);
  }

  return { kubeName, name, type };
};
