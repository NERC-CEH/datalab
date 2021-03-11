import useShallowSelector from './useShallowSelector';
import dataStorageSelectors from '../selectors/dataStorageSelectors';

// eslint-disable-next-line import/prefer-default-export
export const useDataStorageArray = () => useShallowSelector(dataStorageSelectors.dataStorageArray);
export const useDataStorageForUserInProject = (userId, projectKey) => {
  const dataStores = useDataStorageArray();
  return {
    ...dataStores,
    value: dataStores.value.filter(store => store.projectKey === projectKey && store.users.includes(userId)),
  };
};
