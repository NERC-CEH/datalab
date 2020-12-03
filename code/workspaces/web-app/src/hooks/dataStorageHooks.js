import useShallowSelector from './useShallowSelector';
import dataStorageSelectors from '../selectors/dataStorageSelectors';

// eslint-disable-next-line import/prefer-default-export
export const useDataStorageArray = () => useShallowSelector(dataStorageSelectors.dataStorageArray);