import useShallowSelector from './useShallowSelector';
import clustersSelectors from '../selectors/clustersSelectors';

// eslint-disable-next-line import/prefer-default-export
export const useClusters = () => useShallowSelector(clustersSelectors.clusters);
export const useClustersByType = (type) => {
  const clusters = useClusters();

  if (!type) {
    return clusters;
  }

  return {
    ...clusters,
    value: clusters.value.filter(cluster => cluster.type === type),
  };
};
