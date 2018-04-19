const kubeNameDelim = '-';

export const parseKubeName = (kubeName) => {
  const [head, ...tail] = String(kubeName).split(kubeNameDelim);

  return [head, tail.join(kubeNameDelim)];
};

export const getName = kubeName =>
  parseKubeName(kubeName)[1];

export const getType = kubeName =>
  parseKubeName(kubeName)[0];
