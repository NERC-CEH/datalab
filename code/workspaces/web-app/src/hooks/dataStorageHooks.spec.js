import useShallowSelector from './useShallowSelector';
import dataStorageSelectors from '../selectors/dataStorageSelectors';
import { useDataStorageArray, useDataStorageForUserInProject } from './dataStorageHooks';

jest.mock('./useShallowSelector');
useShallowSelector.mockReturnValue('expected-value');

describe('useDataStorageArray', () => {
  it('returns result of shallow selector with correct selector function', () => {
    // Act
    const hookResult = useDataStorageArray();

    // Assert
    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(dataStorageSelectors.dataStorageArray);
    expect(hookResult).toEqual('expected-value');
  });
});

describe('useDataStorageForUserInProject', () => {
  it('returns list of storage filtered to only contain storage for provided user and project', () => {
    const desiredUser = 'desired-user';
    const projectKey = 'testproj';

    // use expected flag to indicate in the test which stores should be returned
    const stores = [
      { expected: true, projectKey, users: [desiredUser] }, // has correct project and user
      { expected: true, projectKey, users: ['other-user', desiredUser] }, // has correct project and user
      { expected: false, projectKey, users: ['other-user'] }, // correct project, missing user
      { expected: false, projectKey: 'other-project', users: [desiredUser] }, // correct user, wrong project
      { expected: false, projectKey, users: null }, // users is null
    ];
    const expectedResult = stores.filter(store => store.expected);
    useShallowSelector.mockReturnValueOnce({ value: stores });

    const result = useDataStorageForUserInProject(desiredUser, projectKey);

    expect(result.value).toEqual(expectedResult);
  });
});
